import { Color, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

export class Effect extends Handle<jeffect> {
    constructor(model: string, x: number, y:number, z: number){
        super(AddSpecialEffect(model, x, y))
        BlzSetSpecialEffectHeight(this.handle, z)
        
        this._x = x
        this._y = y
        this._z = z
    }
    static get(id: jeffect | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'effect'){
            Log.err('Effect: got wrong type of handle.', 2)
        }
        return instance as Effect
    }

    get x(){return this._x}
    set x(x: number){this._x = x; BlzSetSpecialEffectPosition(this.handle, this._x, this._y, this._z)}
    
    get y(){return this._y}
    set y(y: number){this._y = y; BlzSetSpecialEffectPosition(this.handle, this._x, this._y, this._z)}
    
    get z(){return this._z}
    set z(z: number){this._z = z; BlzSetSpecialEffectPosition(this.handle, this._x, this._y, this._z)}

    get yaw(){return this._yaw}
    set yaw(yaw: number){
        this._yaw = yaw
        BlzSetSpecialEffectYaw(this.handle, this._yaw)
    }

    get pitch(){return this._pitch}
    set pitch(pitch: number){
        this._pitch = pitch
        BlzSetSpecialEffectPitch(this.handle, this._pitch)
    }

    get roll(){return this._roll}
    set roll(roll: number){
        this._roll = roll
        BlzSetSpecialEffectRoll(this.handle, this._roll)
    }

    

    get scaleX(){return this._scale_x}
    set scaleX(scale: number){
        scale = scale < 0 ? 0 : scale
        BlzSetSpecialEffectMatrixScale(this.handle, scale / this._scale_x, 1, 1)
        this._scale_x = scale
    }

    get scaleY(){return this._scale_y}
    set scaleY(scale: number){
        scale = scale < 0 ? 0 : scale
        BlzSetSpecialEffectMatrixScale(this.handle, 1, scale / this._scale_y, 1)
        this._scale_y = scale
    }

    get scaleZ(){return this._scale_z}
    set scaleZ(scale: number){
        scale = scale < 0 ? 0 : scale
        BlzSetSpecialEffectMatrixScale(this.handle, 1, 1, scale / this._scale_z)
        this._scale_z = scale
    }

    get color(){return new Color(this._color)}
    set color(color: Color){
        this._color = new Color(color)
        BlzSetSpecialEffectColor(this.handle, Math.floor(255 * color.r),
                                              Math.floor(255 * color.g),
                                              Math.floor(255 * color.b))
        BlzSetSpecialEffectAlpha(this.handle, Math.floor(255 * color.a))
    }

    destroy(){
        BlzSetSpecialEffectScale(this.handle, 0.001)
        DestroyEffect(this.handle)
        super.destroy()
    }

    private _x: number
    private _y: number
    private _z: number
    private _yaw: number = 0;
    private _pitch: number = 0;
    private _roll: number = 0;
    private _scale_x: number = 1;
    private _scale_y: number = 1;
    private _scale_z: number = 1;
    private _color: Color = new Color(1, 1, 1, 1);
}