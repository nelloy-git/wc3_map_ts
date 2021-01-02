import { Color, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

export class Image extends Handle<jimage> {
    constructor(image: string,
                size_x: number, size_y: number, size_z: number,
                origin_x?: number, origin_y?: number, origin_z?: number){
        super(CreateImage(image,
                          size_x, size_y, size_z,
                          0, 0, -5000,
                          origin_x ? origin_x : size_x / 2,
                          origin_y ? origin_y : size_y / 2,
                          origin_z ? origin_z : size_z / 2, 4))
        this._x = 0
        this._y = 0
        this._z = 0
    }
    public static get(id: jimage | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'image'){
            Log.err('Image: got wrong type of handle.', 2)
        }
        return instance as Image
    }

    public get x(){return this._x}
    public set x(x: number){this._x = x; SetImagePosition(this.handle, this._x, this._y, this._z)}
    
    public get y(){return this._y}
    public set y(y: number){this._y = y; SetImagePosition(this.handle, this._x, this._y, this._z)}
    
    public get z(){return this._z}
    public set z(z: number){this._z = z; SetImagePosition(this.handle, this._x, this._y, this._z)}

    public get color(){return new Color(this._color)}
    public set color(color: Color){
        this._color = new Color(color)
        SetImageColor(this.handle, 255 * color.r, 255 *  color.g, 255 * color.b, 255 * color.a)
    }
    
    public get renderAlways(){return this._render_always}
    public set renderAlways(flag: boolean){this._render_always; SetImageRenderAlways(this.handle, flag)}

    public get visible(){return this._visible}
    public set visible(flag: boolean){this._visible = flag; ShowImage(this.handle, flag)}

    destroy(){
        DestroyImage(this.handle)
        super.destroy()
    }

    private _x: number;
    private _y: number;
    private _z: number;
    private _color: Color = new Color(1, 1, 1, 1);
    private _render_always = false
    private _visible = true
}