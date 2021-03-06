layout (std140) uniform UNIFORM_LIGHT{
    vec4 lightColor0;
    vec4 lightColor1;
    vec4 lightColor2;
    vec4 lightColor3;
    vec4 lightIntensity;
    vec4 lightPosX;
    vec4 lightPosY;
    vec4 lightPosZ;
    vec4 light_ambient;
    vec4 lightPrimePos;
    vec4 lightPrimeColor;
};

#define LIGHT_COLOR0 lightColor0
#define LIGHT_COLOR1 lightColor1
#define LIGHT_COLOR2 lightColor2
#define LIGHT_COLOR3 lightColor3

#define MAIN_LIGHT_POS lightPrimePos
#define MAIN_LIGHT_COLOR lightPrimeColor

#define LIGHT_INTENSITY lightIntensity
#define LIGHT_INTENSITY0 lightIntensity.x
#define LIGHT_INTENSITY1 lightIntensity.y
#define LIGHT_INTENSITY2 lightIntensity.z
#define LIGHT_INTENSITY3 lightIntensity.w
