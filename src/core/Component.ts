import { GameObject } from "./GameObject";
import { Transform } from "./Transform";
import { Scene } from "./Scene";

export class Component{
    
    public gameobject?:GameObject;
    public get transform():Transform{
        return this.gameobject.transform;
    }
    public onUpdate?(scene:Scene):void;
    public onStart?():void;
}