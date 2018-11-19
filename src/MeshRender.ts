import { Mesh } from "./Mesh";
import { Material } from "./Material";
import { GameObject } from "./GameObject";
import { ShaderFX } from "./shaderfx/ShaderFX";
import { BaseRender } from "./BaseRender";
import { GLContext } from "./gl/GLContext";
import { GLProgram } from "./gl/GLProgram";

export class MeshRender extends BaseRender{
    public mesh:Mesh;
    public object:GameObject;

    

    public _depthVal:number;


    private m_vao:WebGLVertexArrayObject;

    public get vertexArrayObj():WebGLVertexArrayObject{
        return this.m_vao;
    }

    public constructor(mesh?:Mesh,mat?:Material){
        super();
        this.mesh = mesh;
        this.material = mat;
        this.castShadow = true;
    }
    

    public release(glctx:GLContext){
        if(this.m_vao != null){
            glctx.gl.deleteVertexArray(this.m_vao);
            this.m_vao = null;
        }

        this.mesh = null;
    }

    public draw(gl:WebGL2RenderingContext){
        let mesh = this.mesh;
        const desc = mesh.indiceDesc;
        gl.drawElements(desc.topology,desc.indiceCount,desc.type,desc.offset);
    }
    
    public refreshData(glctx:GLContext){

        let vao = this.m_vao;
        if(vao != null) return;

        let mesh =this.mesh;
        let mat = this.material;
        if(mat == null || mat.program == null){
            throw new Error("material or program is null");
        }

        this.m_vao = MeshRender.CreateVertexArrayObj(glctx,mesh,mat.program);
    }

    public static CreateVertexArrayObj(glctx:GLContext,mesh:Mesh,program:GLProgram):WebGLVertexArrayObject{
        if(!mesh.bufferInited){
            mesh.refreshMeshBuffer(glctx);
        }

        if(program == null) throw new Error("program is null"); 
        let attrs = program.Attributes;
        let vertdesc = mesh.vertexDesc;
        let gl = glctx.gl;
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        if(mesh.seperatedBuffer){
            if(vertdesc.position != null){
                gl.bindBuffer(gl.ARRAY_BUFFER,mesh.bufferVertices);
                let aPos = attrs[ShaderFX.ATTR_aPosition];
                if(aPos != null){
                    let posdesc = vertdesc.position;
                    gl.vertexAttribPointer(aPos,posdesc.size,gl.FLOAT,false,posdesc.size *4,posdesc.offset);
                    gl.enableVertexAttribArray(aPos);
                }
            }
            if(vertdesc.uv !=null){
                gl.bindBuffer(gl.ARRAY_BUFFER,mesh.bufferUV);
                let aUV = attrs[ShaderFX.ATTR_aUV];
                if(aUV != null){
                    let uvdesc = vertdesc.uv;
                    gl.vertexAttribPointer(aUV,uvdesc.size,gl.FLOAT,false,uvdesc.size *4,uvdesc.offset);
                    gl.enableVertexAttribArray(aUV);
                }
            }
            if(vertdesc.normal){
                gl.bindBuffer(gl.ARRAY_BUFFER,mesh.bufferNormal)
                let aNorm = attrs[ShaderFX.ATTR_aNormal];
                if(aNorm !=null){
                    let normdesc = vertdesc.normal;
                    gl.vertexAttribPointer(aNorm,normdesc.size,gl.FLOAT,false,normdesc.size *4,normdesc.offset);
                    gl.enableVertexAttribArray(aNorm);
                }
            }
            gl.bindBuffer(gl.ARRAY_BUFFER,null);
        }
        else{
            gl.bindBuffer(gl.ARRAY_BUFFER,mesh.bufferVertices);
            if(vertdesc.position !=null){
                let aPos = attrs[ShaderFX.ATTR_aPosition];
                if(aPos !=null){
                    let posdesc = vertdesc.position;
                    gl.vertexAttribPointer(aPos,posdesc.size,gl.FLOAT,false,posdesc.size *4,posdesc.offset);
                    gl.enableVertexAttribArray(aPos);
                }
            }
            if(vertdesc.uv !=null){
                let aUV = attrs[ShaderFX.ATTR_aUV];
                if(aUV != null){
                    let uvdesc = vertdesc.uv;
                    gl.vertexAttribPointer(aUV,uvdesc.size,gl.FLOAT,false,uvdesc.size *4,uvdesc.offset);
                    gl.enableVertexAttribArray(aUV);
                }
            }
    
            if(vertdesc.normal){
                let aNorm = attrs[ShaderFX.ATTR_aNormal];
                if(aNorm !=null){
                    let normdesc = vertdesc.normal;
                    gl.vertexAttribPointer(aNorm,normdesc.size,gl.FLOAT,false,normdesc.size *4,normdesc.offset);
                    gl.enableVertexAttribArray(aNorm);
                }
            }
        }

        //indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.bufferIndices);


        gl.bindVertexArray(null);


        return vao;
    }
}


