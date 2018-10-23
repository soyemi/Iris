import { Transform } from "./Transform";
import { MeshRender } from "./MeshRender";
import { Component } from "./Component";
import { Scene } from "./Scene";

export class GameObject{

    public name:string;
    public transform:Transform;
    public components:Component[];
    private m_render:MeshRender;

    public set render(r:MeshRender){
        r.object = this;
        this.m_render = r;
    }
    public get render():MeshRender{
        return this.m_render;
    }
    
    public active:boolean = true;

    public constructor(name?:string){
        this.name = name;
        this.transform = new Transform(this);
    }

    public update(scene:Scene){
        let comp = this.components;
        if(comp != null){
            for(let i=0,len = comp.length;i<len;i++){
                let c = comp[i];
                if(c.onUpdate !=null){
                    c.onUpdate(scene);
                }
            }
        }

        let trs = this.transform;
        let trsdirty = trs.isDirty;
        
        let children = this.transform.children;
        if(children != null){
            for(let i=0,len = children.length;i<len;i++){
                let g = children[i].gameobject;
                g.transform.setObjMatrixDirty(trsdirty);
                g.update(scene);
            }
        }
    }

    public addComponent(c:Component){
        let comps = this.components;
        if(comps == null){
            comps = [];
            this.components = comps;
        }

        let index= comps.indexOf(c);
        if(index >=0) return;

        c.gameobject = this;
        if(c.onStart != null) c.onStart();
        comps.push(c);
    }

    public getComponent<T extends Component>(t:new()=>T){
        let comps = this.components;
        for(let i=0,len = comps.length;i<len;i++){
            if(comps[i] instanceof t) return comps[i];
        }
        return null;
    }

    public getChildByName(name:string):GameObject{
        let children = this.transform.children;
        if(children == null )  return null;

        for(let i=0,len = children.length;i<len;i++){
            let ct = children[i].gameobject;
            if(ct.name === name) return ct;

            let cc = ct.getChildByName(name);
            if(cc != null) return cc;
        }
        return null;
    }
}
