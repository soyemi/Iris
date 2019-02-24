import { RenderQueue } from "../shaderfx/Shader";
import { BaseRender } from "./BaseRender";
import { DoubleBuffered } from "../collection";
import { IndexedBuffer } from "../collection/IndexedBuffer";

export class RenderNodeList{

    public nodeOpaque:IndexedBuffer<BaseRender> = new IndexedBuffer();
    public nodeTransparent:IndexedBuffer<BaseRender> = new IndexedBuffer();
    public nodeImage:IndexedBuffer<BaseRender> = new IndexedBuffer();
    public nodeOverlay:IndexedBuffer<BaseRender> = new IndexedBuffer();
    
    public reset(){
        this.nodeOpaque.empty();
        this.nodeTransparent.empty();
        this.nodeImage.empty();
        this.nodeOverlay.empty();
    }
    public pushRenderNode(rnode:BaseRender){
        let material = rnode.material;
        if(material == null) return;
        let tag = material.shaderTags;
        if(tag == null) return;
        switch(tag.queue){
            case RenderQueue.Opaque:
                this.nodeOpaque.push(rnode);
                break;
            case RenderQueue.Transparent:
                this.nodeTransparent.push(rnode);
                break;
            case RenderQueue.Image:
                this.nodeImage.push(rnode);
                break;
            case RenderQueue.Overlay:
                this.nodeOverlay.push(rnode);
                break;
        }
    }
    public sort(){
        
    }
}
