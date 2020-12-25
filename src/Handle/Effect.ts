import { Color, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

export class Effect extends Handle<jeffect> {
    constructor(model: string, x: number, y:number, z: number){
        super(AddSpecialEffect(model, x, y))
        BlzSetSpecialEffectHeight(this.handle, z)
        
        // if (targ && attach){
        //     super(AddSpecialEffectTarget(model, targ.handle, attach))
        // } else {
        //     super(AddSpecialEffect(model, 0, 0)) 
        // }
    }
    static get(id: jeffect | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'effect'){
            Log.err('Effect: got wrong type of handle.', 2)
        }
        return instance as Effect
    }

    get x(){return BlzGetLocalSpecialEffectX(this.handle)}
    set x(x: number){BlzSetSpecialEffectX(this.handle, x)}
    
    get y(){return BlzGetLocalSpecialEffectY(this.handle)}
    set y(y: number){BlzSetSpecialEffectY(this.handle, y)}
    
    get z(){return BlzGetLocalSpecialEffectZ(this.handle)}
    set z(z: number){BlzSetSpecialEffectZ(this.handle, z)}

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
        this._scale_x = scale < 0 ? 0 : scale
        BlzSetSpecialEffectMatrixScale(this.handle, this._scale_x, this._scale_y, this._scale_z)
    }

    get scaleY(){return this._scale_y}
    set scaleY(scale: number){
        this._scale_y = scale < 0 ? 0 : scale
        BlzSetSpecialEffectMatrixScale(this.handle, this._scale_x, this._scale_y, this._scale_z)
    }

    get scaleZ(){return this._scale_z}
    set scaleZ(scale: number){
        this._scale_z = scale < 0 ? 0 : scale
        BlzSetSpecialEffectMatrixScale(this.handle, this._scale_x, this._scale_y, this._scale_z)
    }

    get color(){return new Color(this._color)}
    set color(color: Color){
        this._color = new Color(color)
        BlzSetSpecialEffectColor(this.handle, 255 * color.r, 255 *  color.g, 255 * color.b)
        BlzSetSpecialEffectAlpha(this.handle, 255 * color.a)
    }

    destroy(){
        BlzSetSpecialEffectScale(this.handle, 0.001)
        DestroyEffect(this.handle)
        super.destroy()
    }

    private _yaw: number = 0;
    private _pitch: number = 0;
    private _roll: number = 0;
    private _scale_x: number = 1;
    private _scale_y: number = 1;
    private _scale_z: number = 1;
    private _color: Color = new Color(1, 1, 1, 1);
}