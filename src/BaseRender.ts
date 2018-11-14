import { GameObject } from "./GameObject";
import { GLContext } from "wglut";
import { Material } from "./Material";


export abstract class BaseRender{

    public material:Material;
    protected m_object:GameObject;
    public get object():GameObject{return this.m_object;}

    public constructor(){

    }
    
    public abstract refreshData(glctx:GLContext)

    public abstract release(glctx:GLContext);
}
