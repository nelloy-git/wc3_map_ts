import { Color } from "../Wc3Utils/index";
import { Handle } from "./Handle";

export class TextTag extends Handle<jtexttag> {
    constructor(){
        super(CreateTextTag())
    }

    public get x(){return this._x}
    public set x(x: number){this._x = x; SetTextTagPos(this.handle, this._x, this._y, this._z)}
    
    public get y(){return this._y}
    public set y(y: number){this._y = y; SetTextTagPos(this.handle, this._x, this._y, this._z)}
    
    public get z(){return this._z}
    public set z(z: number){this._z = z; SetTextTagPos(this.handle, this._x, this._y, this._z)}

    public get text(){return this._text}
    public set text(text: string){this._text = text; SetTextTagText(this.handle, text, 0.0023 * this._font_size)}

    public get fontSize(){return this._font_size}
    public set fontSize(size: number){this._font_size = size; SetTextTagText(this.handle, this._text, 0.0023 * size)}

    public get color(){return new Color(this._color)}
    public set color(color: Color){
        this._color = new Color(color)
        SetTextTagColor(this.handle, 255 * color.r, 255 *  color.g, 255 * color.b, 255 * color.a)
    }

    public get velocity(): [x: number, y: number]{return this._velocity}
    public set velocity(vel: [x: number, y: number]){this._velocity = vel; SetTextTagVelocity(this.handle, vel[0], vel[1])}
    
    public get visible(){return this._visible}
    public set visible(flag: boolean){this._visible = flag; SetTextTagVisibility(this.handle, flag)}

    public get permanent(){return this._permanent}
    public set permanent(flag: boolean){this._permanent = flag; SetTextTagPermanent(this.handle, flag)}

    public get fadepoint(){return this._fadepoint}
    public set fadepoint(val: number){this._fadepoint = val; SetTextTagFadepoint(this.handle, val)}

    public destroy(){
        DestroyTextTag(this.handle)
        super.destroy()
    }

    private _x = 0;
    private _y = 0;
    private _z = 0;
    private _text = ''
    private _font_size = 12
    private _color = new Color(1, 1, 1, 1);
    private _velocity: [x: number, y: number] = [0, 0]
    private _visible = true
    private _permanent = true
    private _fadepoint = 0
}