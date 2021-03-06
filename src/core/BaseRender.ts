import { GameObject } from "./GameObject";
import { Material } from "./Material";
import { GLContext } from "../gl/GLContext";
import { RenderModel } from "../pipeline";
import { RenderQueue } from "../shaderfx";

export abstract class BaseRender{

    public material:Material;
    protected m_object:GameObject;
    public get object():GameObject{return this.m_object;}
    public castShadow:boolean = false;

    public constructor(){
    }

    public get renderQueue():RenderQueue{
        return this.material.shaderTags.queue;
    }

    public abstract refreshData(glctx:GLContext)
    public abstract release(glctx:GLContext);
    public abstract draw(gl:GLContext,model:RenderModel);

}
