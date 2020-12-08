import { Color, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

export class TextTag extends Handle<jtexttag> {
    constructor(){
        super(CreateTextTag())
    }
    static get(id: jtexttag | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'textjtexttag'){
            Log.err('TextTag: got wrong type of handle.', 2)
        }
        return instance as TextTag
    }
    static Timed(text: string, size: number, color: Color,
                 x: number, y: number, z: number,
                 x_vel: number, y_vel: number, lifetime: number){
        let tt = CreateTextTag()
        SetTextTagText(tt, text, 0.0023 * size)
        SetTextTagColor(tt, Math.floor(255 * color.r),
                            Math.floor(255 * color.g),
                            Math.floor(255 * color.b),
                            Math.floor(255 * color.a))
        SetTextTagPos(tt, x, y, z)
        SetTextTagVelocity(tt, x_vel, y_vel)
        SetTextTagPermanent(tt, false)
        SetTextTagLifespan(tt, lifetime)
        SetTextTagFadepoint(tt, 0)
    }

    get x(){return this._x}
    set x(x: number){this._x = x; SetTextTagPos(this.handle, this._x, this._y, this._z)}
    
    get y(){return this._y}
    set y(y: number){this._y = y; SetTextTagPos(this.handle, this._x, this._y, this._z)}
    
    get z(){return this._z}
    set z(z: number){this._z = z; SetTextTagPos(this.handle, this._x, this._y, this._z)}

    get text(){return this._text}
    set text(text: string){this._text = text; SetTextTagText(this.handle, text, 0.0023 * this._font_size)}

    get fontSize(){return this._font_size}
    set fontSize(size: number){this._font_size = size; SetTextTagText(this.handle, this._text, 0.0023 * size)}

    get color(){return new Color(this._color)}
    set color(color: Color){
        this._color = new Color(color)
        SetTextTagColor(this.handle, Math.floor(255 * color.r),
                                     Math.floor(255 * color.g),
                                     Math.floor(255 * color.b),
                                     Math.floor(255 * color.a))
    }

    get velocity(): [x: number, y: number]{return this._velocity}
    set velocity(vel: [x: number, y: number]){this._velocity = vel; SetTextTagVelocity(this.handle, vel[0], vel[1])}
    
    get visible(){return this._visible}
    set visible(flag: boolean){this._visible = flag; SetTextTagVisibility(this.handle, flag)}

    get fadepoint(){return this._fadepoint}
    set fadepoint(val: number){this._fadepoint = val; SetTextTagFadepoint(this.handle, val)}

    destroy(){
        super.destroy()
        DestroyTextTag(this.handle)
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