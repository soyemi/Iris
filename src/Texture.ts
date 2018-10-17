import { GLContext } from "wglut";


export class Texture{

    public static TEMP_TEXID:number;

    private m_raw:WebGLTexture;
    private m_width:number;
    private m_height:number;

    public get rawtexture():WebGLTexture{
        return this.m_raw;
    }

    public constructor(tex?:WebGLTexture,width:number = 0,heigt:number = 0){
        this.m_raw = tex;
        this.m_width = width;
        this.m_height = heigt;
    }

    public static crateEmptyTexture(width:number,height:number,glctx:GLContext):Texture{
        if(width < 2 || height < 2){
            throw new Error('invalid texture size');
        }
        let gl = glctx.gl;
        let tex = gl.createTexture();
        gl.activeTexture(Texture.TEMP_TEXID);
        gl.bindTexture(gl.TEXTURE_2D,tex);
        gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA8,width,height);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D,null);

        return new Texture(tex,width,height);
    }

    public static createTextureSync(buffer:Uint8Array,mime:string,glctx:GLContext,callback?:(suc:boolean)=>void):Texture{
        let blob = new Blob([buffer],{type:mime});
        let url = URL.createObjectURL(blob);
        var image = new Image();
        var tex = new Texture(null);
        image.onload = ()=>{
            let gl = glctx.gl;
            let rawtex = gl.createTexture();
            gl.activeTexture(Texture.TEMP_TEXID);
            gl.bindTexture(gl.TEXTURE_2D,rawtex);
            gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D,null);
            tex.m_width= image.width;
            tex.m_height = image.height;
            tex.m_raw = rawtex;

            if(callback !=null) callback(true);
        }
        image.onerror = (ev)=>{
            console.error(ev);
            if(callback !=null) callback(false);
        }
        image.src = url;
        return tex;
    }

    public static async createTexture(buffer:Uint8Array,mime:string,glctx:GLContext):Promise<Texture>{
        return new Promise<Texture>((res,rej)=>{
            var tex = Texture.createTextureSync(buffer,mime,glctx,(suc)=>{
                if(suc){
                    res(tex);
                }
                else{
                    rej('failed');
                }
            })
        })
    }
}