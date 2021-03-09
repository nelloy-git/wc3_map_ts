import { Color, getFilePath, getTerrainZ, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

let __path__ = Macro(getFilePath())

export class hImage extends Handle<jimage> {
    constructor(path: string,
                size_x?: number, size_y?: number,
                origin_x?: number, origin_y?: number){
        size_x = size_x ? size_x : 16
        size_y = size_y ? size_y : 16

        super(CreateImage(path,
                          size_x, size_y, 0,
                          0, 0, -5000,
                          origin_x ? origin_x : size_x / 2,
                          origin_y ? origin_y : size_y / 2,
                          0, 4))

        this.path = path
        this.__x = 0
        this.__y = 0
        this.__z = 0
        this.__color = new Color(1, 1, 1, 1)
        this.__visible = true
        this.__render_always = false
        this.__constant_height = true

        this.renderAlways = true
        this.z = 10
    }
    static get(id: jimage | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'image'){
            Log.err('Image: got wrong type of handle.',
                    __path__, hImage, 2)
        }
        return instance as hImage
    }

    get x(){return this.__x}
    set x(x: number){
        this.__x = x
        SetImagePosition(this.handle, this.__x, this.__y, this.__z)
        SetImageConstantHeight(this.handle, this.__constant_height, getTerrainZ(this.__x, this.__y) + this.__z)
    }
    
    get y(){return this.__y}
    set y(y: number){
        this.__y = y
        SetImagePosition(this.handle, this.__x, this.__y, this.__z)
        SetImageConstantHeight(this.handle, this.__constant_height, getTerrainZ(this.__x, this.__y) + this.__z)
    }
    
    get z(){return this.__z}
    set z(z: number){
        this.__z = z
        SetImageConstantHeight(this.handle, this.__constant_height, getTerrainZ(this.__x, this.__y) + this.__z)
    }

    get color(){return new Color(this.__color)}
    set color(color: Color){
        this.__color = new Color(color)
        SetImageColor(this.handle, math.floor(255 * color.r),
                                   math.floor(255 * color.g),
                                   math.floor(255 * color.b),
                                   math.floor(255 * color.a))
    }
    
    get renderAlways(){return this.__render_always}
    set renderAlways(flag: boolean){this.__render_always; SetImageRenderAlways(this.handle, flag)}

    get visible(){return this.__visible}
    set visible(flag: boolean){this.__visible = flag; ShowImage(this.handle, flag)}

    get constantHeight(){return this.__constant_height}
    set constantHeight(f: boolean){
        this.__constant_height = f
        SetImageConstantHeight(this.handle, f, getTerrainZ(this.__x, this.__y) + this.__z)
    }

    destroy(){
        DestroyImage(this.handle)
        super.destroy()
    }

    readonly path: string
    private __x: number
    private __y: number
    private __z: number
    private __color: Color
    private __render_always: boolean
    private __visible: boolean
    private __constant_height: boolean
}