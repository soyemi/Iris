#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#options ENVMAP_TYPE CUBE TEX PCG
#queue skybox

inout vec3 vWorldDir;

#ifdef ENVMAP_TYPE_CUBE
uniform samplerCube uSampler;
#elif defined(ENVMAP_TYPE_TEX)
uniform sampler2D uSampler;
#elif defined(ENVMAP_TYPE_PCG)

#define SAMPLES_NUMS 16
// https://www.shadertoy.com/view/XlBfRD
// License (MIT) Copyright (C) 2017-2018 Rui. All rights reserved.
struct ScatteringParams
{
    float sunRadius;
	float sunRadiance;

	float mieG;
	float mieHeight;

	float rayleighHeight;

	vec3 waveLambdaMie;
	vec3 waveLambdaOzone;
	vec3 waveLambdaRayleigh;

	float earthRadius;
	float earthAtmTopRadius;
	vec3 earthCenter;
};

vec3 ComputeSphereNormal(vec2 coord, float phiStart, float phiLength, float thetaStart, float thetaLength)
{
	vec3 normal;
	normal.x = -sin(thetaStart + coord.y * thetaLength) * sin(phiStart + coord.x * phiLength);
	normal.y = -cos(thetaStart + coord.y * thetaLength);
	normal.z = -sin(thetaStart + coord.y * thetaLength) * cos(phiStart + coord.x * phiLength);
	return normalize(normal);
}

vec2 ComputeRaySphereIntersection(vec3 position, vec3 dir, vec3 center, float radius)
{
	vec3 origin = position - center;
	float B = dot(origin, dir);
	float C = dot(origin, origin) - radius * radius;
	float D = B * B - C;

	vec2 minimaxIntersections;
	if (D < 0.0)
	{
		minimaxIntersections = vec2(-1.0, -1.0);
	}
	else
	{
		D = sqrt(D);
		minimaxIntersections = vec2(-B - D, -B + D);
	}

	return minimaxIntersections;
}

vec3 ComputeWaveLambdaRayleigh(vec3 lambda)
{
	const float n = 1.0003;
	const float N = 2.545E25;
	const float pn = 0.035;
	const float n2 = n * n;
	const float pi3 = PI * PI * PI;
	const float rayleighConst = (8.0 * pi3 * pow(n2 - 1.0,2.0)) / (3.0 * N) * ((6.0 + 3.0 * pn) / (6.0 - 7.0 * pn));
	return rayleighConst / (lambda * lambda * lambda * lambda);
}

float ComputePhaseMie(float theta, float g)
{
	float g2 = g * g;
	return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * saturate(theta), 1.5) / (4.0 * PI);
}

float ComputePhaseRayleigh(float theta)
{
	float theta2 = theta * theta;
	return (theta2 * 0.75 + 0.75) / (4.0 * PI);
}

float ChapmanApproximation(float X, float h, float cosZenith)
{
	float c = sqrt(X + h);
	float c_exp_h = c * exp(-h);

	if (cosZenith >= 0.0)
	{
		return c_exp_h / (c * cosZenith + 1.0);
	}
	else
	{
		float x0 = sqrt(1.0 - cosZenith * cosZenith) * (X + h);
		float c0 = sqrt(x0);

		return 2.0 * c0 * exp(X - x0) - c_exp_h / (1.0 - c * cosZenith);
	}
}

float GetOpticalDepthSchueler(float h, float H, float earthRadius, float cosZenith)
{
	return H * ChapmanApproximation(earthRadius / H, h / H, cosZenith);
}

vec3 GetTransmittance(ScatteringParams setting, vec3 L, vec3 V)
{
	float ch = GetOpticalDepthSchueler(L.y, setting.rayleighHeight, setting.earthRadius, V.y);
	return exp(-(setting.waveLambdaMie + setting.waveLambdaRayleigh) * ch);
}

vec2 ComputeOpticalDepth(ScatteringParams setting, vec3 samplePoint, vec3 V, vec3 L, float neg)
{
	float rl = length(samplePoint);
	float h = rl - setting.earthRadius;
	vec3 r = samplePoint / rl;

	float cos_chi_sun = dot(r, L);
	float cos_chi_ray = dot(r, V * neg);

	float opticalDepthSun = GetOpticalDepthSchueler(h, setting.rayleighHeight, setting.earthRadius, cos_chi_sun);
	float opticalDepthCamera = GetOpticalDepthSchueler(h, setting.rayleighHeight, setting.earthRadius, cos_chi_ray) * neg;

	return vec2(opticalDepthSun, opticalDepthCamera);
}

void AerialPerspective(ScatteringParams setting, vec3 start, vec3 end, vec3 V, vec3 L, bool infinite, out vec3 transmittance, out vec3 insctrMie, out vec3 insctrRayleigh)
{
	float inf_neg = infinite ? 1.0 : -1.0;

	vec3 sampleStep = (end - start) / float(SAMPLES_NUMS);
	vec3 samplePoint = end - sampleStep;
	vec3 sampleLambda = setting.waveLambdaMie + setting.waveLambdaRayleigh + setting.waveLambdaOzone;

	float sampleLength = length(sampleStep);

	vec3 scattering = vec3(0.0);
	vec2 lastOpticalDepth = ComputeOpticalDepth(setting, end, V, L, inf_neg);

	for (int i = 1; i < SAMPLES_NUMS; i++, samplePoint -= sampleStep)
	{
		vec2 opticalDepth = ComputeOpticalDepth(setting, samplePoint, V, L, inf_neg);

		vec3 segment_s = exp(-sampleLambda * (opticalDepth.x + lastOpticalDepth.x));
		vec3 segment_t = exp(-sampleLambda * (opticalDepth.y - lastOpticalDepth.y));
		
		transmittance *= segment_t;
		
		scattering = scattering * segment_t;
		scattering += exp(-(length(samplePoint) - setting.earthRadius) / setting.rayleighHeight) * segment_s;

		lastOpticalDepth = opticalDepth;
	}

	insctrMie = scattering * setting.waveLambdaMie * sampleLength;
	insctrRayleigh = scattering * setting.waveLambdaRayleigh * sampleLength;
}

float ComputeSkyboxChapman(ScatteringParams setting, vec3 eye, vec3 V, vec3 L, out vec3 transmittance, out vec3 insctrMie, out vec3 insctrRayleigh)
{
	bool neg = true;

	vec2 outerIntersections = ComputeRaySphereIntersection(eye, V, setting.earthCenter, setting.earthAtmTopRadius);
	if (outerIntersections.y < 0.0) return 0.0;

	vec2 innerIntersections = ComputeRaySphereIntersection(eye, V, setting.earthCenter, setting.earthRadius);
	if (innerIntersections.x > 0.0)
	{
		neg = false;
		outerIntersections.y = innerIntersections.x;
	}

	eye -= setting.earthCenter;

	vec3 start = eye + V * max(0.0, outerIntersections.x);
	vec3 end = eye + V * outerIntersections.y;

	AerialPerspective(setting, start, end, V, L, neg, transmittance, insctrMie, insctrRayleigh);

	bool intersectionTest = innerIntersections.x < 0.0 && innerIntersections.y < 0.0;
	return intersectionTest ? 1.0 : 0.0;
}

vec4 ComputeSkyInscattering(ScatteringParams setting, vec3 eye, vec3 V, vec3 L)
{
	vec3 insctrMie = vec3(0.0);
	vec3 insctrRayleigh = vec3(0.0);
	vec3 insctrOpticalLength = vec3(1.0);
	float intersectionTest = ComputeSkyboxChapman(setting, eye, V, L, insctrOpticalLength, insctrMie, insctrRayleigh);

	float phaseTheta = dot(V, L);
	float phaseMie = ComputePhaseMie(phaseTheta, setting.mieG);
	float phaseRayleigh = ComputePhaseRayleigh(phaseTheta);
	float phaseNight = 1.0 - saturate(insctrOpticalLength.x * EPSILON);

	vec3 insctrTotalMie = insctrMie * phaseMie;
	vec3 insctrTotalRayleigh = insctrRayleigh * phaseRayleigh;

	vec3 sky = (insctrTotalMie + insctrTotalRayleigh) * setting.sunRadiance;

	float angle = saturate((1.0 - phaseTheta) * setting.sunRadius);
	float cosAngle = cos(angle * PI * 0.5);
	float edge = ((angle >= 0.9) ? smoothstep(0.9, 1.0, angle) : 0.0);
                         
	vec3 limbDarkening = GetTransmittance(setting, -L, V);
	limbDarkening *= pow(vec3(cosAngle), vec3(0.420, 0.503, 0.652)) * mix(vec3(1.0), vec3(1.2,0.9,0.5), edge) * intersectionTest;

	sky += limbDarkening;

	return vec4(sky, phaseNight * intersectionTest);
}

vec3 TonemapACES(vec3 x)
{
	const float A = 2.51f;
	const float B = 0.03f;
	const float C = 2.43f;
	const float D = 0.59f;
	const float E = 0.14f;
	return (x * (A * x + B)) / (x * (C * x + D) + E);
}

float noise(vec2 uv)
{
	return fract(dot(sin(uv.xyx * uv.xyy * 1024.0), vec3(341896.483, 891618.637, 602649.7031)));
}

#endif

#pragma vs vertex
#ifdef SHADER_VS
in vec4 aPosition;
void vertex(){
    vec4 pos = aPosition;
    pos.xy*=2.0;
    pos.z = 1.0;
    gl_Position = pos;

    vec4 wpos =  inverse(MATRIX_VP) * pos;
    wpos.xyz = wpos.xyz / wpos.w - CAMERA_POS.xyz;
    vWorldDir = wpos.xyz;
    
}
#endif

#pragma ps fragment
#ifdef SHADER_PS
out lowp vec4 fragColor;
void fragment(){
    vec3 dir = vWorldDir.xyz;
    #ifdef ENVMAP_TYPE_CUBE
    fragColor = texture(uSampler,dir);
    #elif defined(ENVMAP_TYPE_TEX)
    dir = normalize(dir);
    float y = 1.0 - 0.5 *(1.0 + dir.y);
    float x = atan(dir.z,dir.x) / PI_2 + 0.5;
    fragColor = texture(uSampler,vec2(x,y));
    #elif defined(ENVMAP_TYPE_PCG)

    vec3 V = normalize(dir);
    vec3 L = normalize(vec3(0,0.5,0.5));

    ScatteringParams setting;
	setting.sunRadius = 500.0;
	setting.sunRadiance = 20.0;
	setting.mieG = 0.76;
	setting.mieHeight = 1200.0;
	setting.rayleighHeight = 8000.0;
	setting.earthRadius = 6360000.0;
	setting.earthAtmTopRadius = 6420000.0;
	setting.earthCenter = vec3(0, -setting.earthRadius, 0);
	setting.waveLambdaMie = vec3(2e-7);
    // wavelength with 680nm, 550nm, 450nm
    setting.waveLambdaRayleigh = ComputeWaveLambdaRayleigh(vec3(680e-9, 550e-9, 450e-9));
    
    // see https://www.shadertoy.com/view/MllBR2
	setting.waveLambdaOzone = vec3(1.36820899679147, 3.31405330400124, 0.13601728252538) * 0.6e-6 * 2.504;
	
    vec3 eye = vec3(0,1000.0,0);
   	vec4 sky = ComputeSkyInscattering(setting, eye, V, L);
    sky.rgb = TonemapACES(sky.rgb * 2.0);
    sky.rgb = pow(sky.rgb, vec3(1.0 / 2.2)); // gamma
    sky.rgb += noise(dir.xy * TIME.z) / 255.0; // dither
	fragColor = vec4(sky.rgb, 1.0);
    #endif
}
#endif
