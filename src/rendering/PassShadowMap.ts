// import { Scene } from "../Scene";
// import { Shader } from "../shaderfx/Shader";
// import { glmath, vec3, mat4, vec4 } from "../math/GLMath";
// import { ShaderFX, ShaderFile } from "../shaderfx/ShaderFX";
// import { ShadowCascade, ShadowConfig } from "./Shadow";
// import { Texture2D } from "../Texture2D";
// import { Light, LightType } from "../Light";
// import { Camera } from "../Camera";
// import { Mesh } from "../Mesh";
// import { ShaderSource } from "../shaderfx/ShaderSource";
// import { Material } from "../Material";
// import { RenderPass } from "./RenderPass";
// import { BaseRender } from "../BaseRender";
// import { GLProgram } from "../gl/GLProgram";
// import { TextureCreationDesc } from "../Texture";

// export class PassShadowMap extends RenderPass {
//     private m_shader: Shader;
//     private m_program: GLProgram;
//     private m_uniformLightVP: WebGLUniformLocation;

//     private m_blockIndexBasis: number;
//     private m_blockIndexObj: number;

//     private m_smwidth: number;
//     private m_smheight: number;

//     private m_smtex: Texture2D;
//     private m_smfb: WebGLFramebuffer;

//     //ShadowGathering
//     private m_shadowTexture: Texture2D;
//     private m_shadowFB: WebGLFramebuffer;
//     private m_quadMesh: Mesh;
//     private m_quadVAO: WebGLVertexArrayObject;
//     private m_gatherMat: Material;

//     @ShaderFile("shadowsGather")
//     private static SH_shadowGather: ShaderSource;
//     private static s_shadowGatherShader: Shader;

//     public constructor(pipeline: PipelineBase) {
//         super(pipeline);

//         this.initShadowMaps();
//     }

//     private initShadowMaps() {
//         // let pipe = this.pipeline;
//         // let gl = pipe.GL;
//         // let glctx = pipe.GLCtx;

//         // let config = pipe.graphicRender.shadowConfig;

//         // let shader = pipe.graphicRender.shaderLib.shaderShadowMap;
//         // let program = shader.defaultProgram;
//         // this.m_shader = shader;
//         // this.m_program = program;
//         // this.m_uniformLightVP = program.Uniforms['uLightVP'];

//         // let ublocks = program.UniformBlock;
//         // let indexCam = ublocks[ShaderFX.UNIFORM_BASIS];
//         // let indexObj = ublocks[ShaderFX.UNIFORM_OBJ];
//         // this.m_blockIndexBasis = indexCam;
//         // this.m_blockIndexObj = indexObj;

//         // let size = config.shadowmapSize;

//         // let smheight = size;
//         // let smwidth = size;
//         // if (config.cascade == ShadowCascade.TwoCascade) {
//         //     smwidth *= 2;
//         // }
//         // this.m_smheight = smheight;
//         // this.m_smwidth = smwidth;

//         // //depth texture and framebuffer

//         // let smtexdesc:TextureCreationDesc = {
//         //     internalformat: gl.DEPTH_COMPONENT24,
//         //     mipmap:false,
//         //     mag_filter:gl.NEAREST,
//         //     min_filter:gl.NEAREST
//         // };
//         // let smtex = Texture2D.createTexture2D(smwidth, smheight, smtexdesc, glctx);
//         // this.m_smtex = smtex;


//         // gl.activeTexture(gl.TEXTURE12);
//         // gl.bindTexture(gl.TEXTURE_2D, smtex.getRawTexture());

//         // let smfb = gl.createFramebuffer();
//         // this.m_smfb = smfb;
//         // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, smfb);
//         // gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, smtex.getRawTexture(), 0);
//         // // let status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
//         // // if (status != gl.FRAMEBUFFER_COMPLETE) {
//         // //     console.error('fb status incomplete ' + status.toString(16));
//         // // }
//         // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);


//         // let debuginfo = new BufferDebugInfo(this.m_smtex, glmath.vec4(200, 0, 200, 200));
//         // pipe.addBufferDebugInfo(debuginfo);

//         // //shadow gather

//         // if (PassShadowMap.s_shadowGatherShader == null) {
//         //     let gathersh = ShaderFX.compileShaders(glctx, PassShadowMap.SH_shadowGather);
//         //     PassShadowMap.s_shadowGatherShader = gathersh;
//         // }

//         // let gathermat = new Material(PassShadowMap.s_shadowGatherShader);
//         // let gatherProj = gathermat.program;
//         // this.m_gatherMat = gathermat;

//         // gathermat.setTexture("uDepthTexure", pipe.depthRT);
//         // gathermat.setTexture("uShadowMap", this.m_smtex);

//         // this.m_quadMesh = Mesh.Quad;
//         // this.m_quadVAO = MeshRender.CreateVertexArrayObj(glctx, this.m_quadMesh, gatherProj);


//         // let texdesc:TextureCreationDesc = {
//         //     format: gl.RGB,
//         //     internalformat:gl.RGB8,
//         //     mipmap:false,
//         //     min_filter: gl.LINEAR,
//         //     mag_filter:gl.LINEAR
//         // };
//         // let stex = Texture2D.createTexture2D(pipe.mainFBwidth, pipe.mainFBheight, texdesc, glctx);
//         // this.m_shadowTexture = stex;

//         // let sfb = gl.createFramebuffer();
//         // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, sfb);
//         // gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, stex.getRawTexture(), 0);
//         // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
//         // this.m_shadowFB = sfb;

//         // let debugshadows = new BufferDebugInfo(stex, glmath.vec4(0, 200, 200, 200));
//         // pipe.addBufferDebugInfo(debugshadows);


//     }

//     public render(scene: Scene) {
//         // const CLASS = PipelineBase;

//         // let queue = this.pipeline.nodeList.nodeOpaque;

//         // let cam = scene.mainCamera;
//         // if (cam == null) return;
//         // let pipe = this.pipeline;
//         // cam.aspect = pipe.mainFrameBufferAspect;
//         // let config = pipe.graphicRender.shadowConfig;

//         // //use program 
//         // let program = this.m_program;
//         // let gl = pipe.GL;
//         // let glp = program.Program;
//         // gl.useProgram(glp);
//         // gl.uniformBlockBinding(glp, this.m_blockIndexBasis, CLASS.UNIFORMINDEX_BASIS);
//         // gl.uniformBlockBinding(glp, this.m_blockIndexObj, CLASS.UNIFORMINDEX_OBJ);

//         // let lights = scene.lights;
//         // for (let i = 0, lcount = lights.length; i < lcount; i++) {
//         //     this.renderLightShadowMap(lights[i], cam, queue, config);
//         // }

//         // //update shadowmap uniform buffer
//         // let smdata = this.pipeline.shaderDataShadowMap;
//         // pipe.updateUniformBufferShadowMap(smdata);

//         // pipe.bindTargetFrameBuffer(true,true);
//     }

//     private renderLightShadowMap(light: Light, camera: Camera, queue: BaseRender[], config: ShadowConfig) {

//         // if (light.lightType != LightType.direction) return;

//         // let pipe = this.pipeline;
//         // let gl = pipe.GL;
//         // let smdata = pipe.shaderDataShadowMap;

//         // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.m_smfb);
//         // gl.enable(gl.DEPTH_TEST);
//         // gl.depthFunc(gl.LEQUAL);
//         // gl.clearDepth(1.0);
//         // gl.clear(gl.DEPTH_BUFFER_BIT);
//         // gl.viewport(0, 0, this.m_smwidth, this.m_smheight);

//         // let lightMtxs = this.calculateLightMatrix(light, camera, config);
//         // let [lightworldMtx, lightProjMtx] = lightMtxs[0];

//         // let lightMtxVP = lightProjMtx.mul(lightworldMtx);
//         // smdata.setLightMtx(lightMtxVP, 0);
//         // pipe.shadowMapData.lightMtx0 = lightMtxVP;

//         // let cascades = config.cascade;
//         // let size = this.m_smheight;
//         // if (cascades == 1) {
//         //     this.renderShadowCascade(glmath.vec4(0, 0, size, size), queue, lightMtxVP);
//         // }
//         // else if (cascades == 2) {
//         //     this.renderShadowCascade(glmath.vec4(0, 0, size, size), queue, lightMtxVP);
//         //     this.renderShadowCascade(glmath.vec4(size, 0, size, size), queue, lightMtxVP);
//         // } else {
//         //     this.renderShadowCascade(glmath.vec4(0, 0, size, size), queue, lightMtxVP);
//         //     this.renderShadowCascade(glmath.vec4(size, 0, size, size), queue, lightMtxVP);
//         //     this.renderShadowCascade(glmath.vec4(0, size, size, size), queue, lightMtxVP);
//         //     this.renderShadowCascade(glmath.vec4(size, size, size, size), queue, lightMtxVP);
//         // }

//         // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
//     }

//     private calculateLightMatrix(light: Light, camera: Camera, config: ShadowConfig): [mat4, mat4][] {
//         // let ctrs = camera.transform;
//         // let near = camera.near;
//         // let far = camera.far;

//         // let camdist = far - near;
//         // let shadowDis = Math.min(camdist, config.shadowDistance);
//         // let cascades: number = config.cascade;
//         // let cascadeSplit: number[] = config.cascadeSplit;

//         // let fardist = near;
//         // let neardist = near;

//         // let campos = ctrs.position;
//         // let camforward = ctrs.worldForward;

//         // let hCoefficient = Math.tan(camera.fov / 2.0 * glmath.Deg2Rad);
//         // let wCoefficient = hCoefficient * camera.aspect;

//         // let ldir = light.lightPosData;
//         // let lup = vec3.up;
//         // if (Math.abs(vec3.Dot(lup, ldir)) > 0.99) {
//         //     lup = glmath.vec3(0, 1, 0.001);
//         // }

//         // let ret = [];

//         // for (let i = 0; i < cascades; i++) {
//         //     let dist = cascadeSplit[i] * shadowDis;
//         //     fardist += dist;

//         //     let d = dist * 0.5;

//         //     let cdist = neardist + d;
//         //     let cpos = campos.clone().sub(camforward.clone().mul(cdist));
//         //     let h = fardist * hCoefficient;
//         //     let w = fardist * wCoefficient;

//         //     let r = Math.sqrt(h * h + d * d + w * w);
//         //     let lpos = cpos.sub(ldir.mulToRef(r));

//         //     let vmtx = mat4.coordCvt(lpos, ldir, lup);
//         //     let pmtx = mat4.orthographic(r, r, 0.1, r * 2.0);

//         //     ret.push([vmtx, pmtx]);

//         //     //next frausta
//         //     neardist += dist;
//         // }
//         // return ret;
    
//         return null;
//     }

//     private renderShadowCascade(vp: vec4, queue: BaseRender[], lmtxVP: mat4) {
//         // let pipe = this.pipeline;
//         // let glctx = pipe.GLCtx;
//         // let gl = glctx.getWebGLRenderingContext();

//         // gl.uniformMatrix4fv(this.m_uniformLightVP, false, lmtxVP.raw);
//         // glctx.viewport(vp.x, vp.y, vp.z, vp.w);
//         // let objdata = pipe.shaderDataObj;

//         // let queueLen = queue.length;
//         // for (let i = 0; i < queueLen; i++) {
//         //     let node = queue[i];
//         //     if (!node.castShadow) continue;
//         //     if (node instanceof MeshRender) {
//         //         let mat = node.material;
//         //         let mesh = node.mesh;
//         //         if (mat == null || mesh == null) continue;
//         //         node.refreshData(glctx);

//         //         let trs = node.object.transform;
//         //         objdata.setMtxModel(trs.objMatrix);
//         //         pipe.updateUniformBufferObject(objdata);

//         //         node.bindVertexArray(glctx);
//         //         let indicesDesc = mesh.indiceDesc;
//         //         gl.drawElements(indicesDesc.topology, indicesDesc.indiceCount, indicesDesc.type, indicesDesc.offset);
//         //         node.unbindVertexArray(glctx);
//         //     }
//         // }
//     }

//     private shadowGathering(light: Light) {

//         // const CLASS = PipelineBase;


//         // let dataSM = this.pipeline.shaderDataShadowMap;

//         // dataSM.setLightMtx(this.pipeline.shadowMapData.lightMtx0, 0);
//         // this.pipeline.updateUniformBufferShadowMap(dataSM);

//         // const gl = this.pipeline.GL;
//         // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.m_shadowFB);
//         // gl.clearColor(0, 0, 0, 0);
//         // gl.clear(gl.COLOR_BUFFER_BIT);

//         // let shadowtex = this.m_shadowTexture;

//         // gl.viewport(0, 0, shadowtex.width, shadowtex.height);

//         // let mat = this.m_gatherMat;
//         // let program = mat.program;

//         // let glp = program.Program;
//         // gl.useProgram(glp);


//         // let blocks = program.UniformBlock;
//         // let indexSM = blocks[ShaderFX.UNIFORM_SHADOWMAP];
//         // if (indexSM != null) {
//         //     gl.uniformBlockBinding(glp, indexSM, CLASS.UNIFORMINDEX_SHADOWMAP);
//         // }

//         // let indexBasis = blocks[ShaderFX.UNIFORM_BASIS];
//         // if (indexBasis != null) {
//         //     gl.uniformBlockBinding(glp, indexBasis, CLASS.UNIFORMINDEX_BASIS);
//         // }

//         // let indexObj = blocks[ShaderFX.UNIFORM_OBJ];
//         // if (indexObj != null) {
//         //     gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);
//         // }

//         // mat.apply(gl);

//         // let mesh = this.m_quadMesh;
//         // let vao = this.m_quadVAO;
//         // gl.bindVertexArray(vao);

//         // let indices = mesh.indiceDesc;
//         // gl.drawElements(gl.TRIANGLES, indices.indiceCount, indices.type, indices.offset);
//         // gl.bindVertexArray(null);

//         // gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);


//     }
// }
