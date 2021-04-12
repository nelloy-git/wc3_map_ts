import { Vec3 } from "../Math";
import { Color, getTerrainZ } from "../Utils";
import { Handle } from "./Handle";

export class hImage extends Handle<jimage> {
    constructor(path: string,
                size_x: number = 16, size_y: number = 16,
                origin_x: number = 8, origin_y: number = 8){

        super(CreateImage(path,
                          size_x, size_y, 0,
                          0, 0, -5000,
                          origin_x, origin_y,
                          0, 4))

        this.path = path
        this.__pos = new Vec3(0, 0, 0)
        this.__color = new Color()
        this.__visible = false
        this.__render_always = false
        this.__constant_height = false
    }

    static get(id: jimage | number){
        return Handle.get(id, 'image') as hImage | undefined
    }

    get pos(){return this.__pos.copy()}
    set pos(v: Vec3){
        this.__pos = v.copy()
        SetImagePosition(this.handle, v.x, v.y, v.z)
        if (this.__constant_height){
            SetImageConstantHeight(this.handle, true, getTerrainZ(v.x, v.y) + v.z)
        }
    }

    get color(){return this.__color.copy()}
    set color(color: Color){
        this.__color = color.copy()
        SetImageColor(this.handle, color.r, color.g, color.b, color.a)
    }
    
    get renderAlways(){return this.__render_always}
    set renderAlways(flag: boolean){
        this.__render_always
        SetImageRenderAlways(this.handle, flag)
    }

    get visible(){return this.__visible}
    set visible(flag: boolean){
        this.__visible = flag
        ShowImage(this.handle, flag)
    }

    get constantHeight(){return this.__constant_height}
    set constantHeight(f: boolean){
        this.__constant_height = f
        let v = this.__pos
        SetImageConstantHeight(this.handle, f, getTerrainZ(v.x, v.y) + v.z)
    }

    destroy(){
        DestroyImage(this.handle)
        super.destroy()
    }

    readonly path: string
    private __pos: Vec3
    private __color: Color
    private __render_always: boolean
    private __visible: boolean
    private __constant_height: boolean
}