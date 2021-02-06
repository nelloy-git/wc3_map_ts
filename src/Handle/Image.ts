import { Color, getFilePath, getTerrainZ, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

let __path__ = Macro(getFilePath())

export class hImage extends Handle<jimage> {
    constructor(image: string,
                size_x?: number, size_y?: number,
                origin_x?: number, origin_y?: number){
        size_x = size_x ? size_x : 16
        size_y = size_y ? size_y : 16

        super(CreateImage(image,
                          size_x, size_y, 0,
                          0, 0, -5000,
                          origin_x ? origin_x : size_x / 2,
                          origin_y ? origin_y : size_y / 2,
                          0, 4))
        this._x = 0
        this._y = 0
        this._z = 0
        this._color = new Color(1, 1, 1, 1)
        this._visible = true
        this._render_always = false

        this.renderAlways = true
        this.z = 10
    }
    public static get(id: jimage | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'image'){
            Log.err('Image: got wrong type of handle.',
                    __path__, hImage, 2)
        }
        return instance as hImage
    }

    public get x(){return this._x}
    public set x(x: number){
        this._x = x
        SetImagePosition(this.handle, this._x, this._y, this._z)
        SetImageConstantHeight(this.handle, true, getTerrainZ(this._x, this._y) + this._z)
    }
    
    public get y(){return this._y}
    public set y(y: number){
        this._y = y
        SetImagePosition(this.handle, this._x, this._y, this._z)
        SetImageConstantHeight(this.handle, true, getTerrainZ(this._x, this._y) + this._z)
    }
    
    public get z(){return this._z}
    public set z(z: number){
        this._z = z
        SetImageConstantHeight(this.handle, true, getTerrainZ(this._x, this._y) + this._z)
    }

    public get color(){return new Color(this._color)}
    public set color(color: Color){
        this._color = new Color(color)
        SetImageColor(this.handle, math.floor(255 * color.r),
                                   math.floor(255 * color.g),
                                   math.floor(255 * color.b),
                                   math.floor(255 * color.a))
    }
    
    public get renderAlways(){return this._render_always}
    public set renderAlways(flag: boolean){this._render_always; SetImageRenderAlways(this.handle, flag)}

    public get visible(){return this._visible}
    public set visible(flag: boolean){this._visible = flag; ShowImage(this.handle, flag)}

    destroy(){
        DestroyImage(this.handle)
        super.destroy()
    }

    private _x: number
    private _y: number
    private _z: number
    private _color: Color
    private _render_always: boolean
    private _visible: boolean
}