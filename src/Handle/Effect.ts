import { hUnit } from "./Unit";
import { Color, getFilePath, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

let __path__ = Macro(getFilePath())

export class hEffect extends Handle<jeffect> {
    constructor(model: string, pos: [number, number, number])
    constructor(model: string, x: number, y:number, z: number)
    constructor(model: string, x_or_pos: number | [number, number, number], y?:number, z?: number){
        let x
        if (typeof x_or_pos !== 'number'){
            x = x_or_pos[0]
            y = x_or_pos[1]
            z = x_or_pos[2]
        } else {
            x = x_or_pos
            y = <number> y
            z = <number> z
        }

        super(AddSpecialEffect(model, x, y))
        BlzSetSpecialEffectHeight(this.handle, z)
        BlzPlaySpecialEffect(this.handle, ANIM_TYPE_STAND)
        
        this.__pos = [x, y, z]
        this.__visible = true
        this.__yaw = 0
        this.__pitch = 0
        this.__roll = 0
        this.__scale = [1, 1, 1]
        this.__color = new Color(1, 1, 1, 1)
    }

    static get(id: jeffect | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'effect'){
            Log.err('got wrong type of handle.',
                    __path__, hEffect, 2)
        }
        return instance as hEffect
    }

    get pos(){return [this.__pos[0], this.__pos[1], this.__pos[2]]}
    set pos(p: [number, number, number]){
        this.__pos = [p[0], p[1], p[2]]
        this.__updPos()
    }

    get x(){return this.__pos[0]}
    set x(x: number){
        this.__pos[0] = x
        this.__updPos()
    }
    
    get y(){return this.__pos[1]}
    set y(y: number){
        this.__pos[1] = y
        this.__updPos()
    }
    
    get z(){return this.__pos[2]}
    set z(z: number){
        this.__pos[2] = z
        this.__updPos()
    }
    
    get visible(){return this.__visible}
    set visible(flag: boolean){
        this.__visible = flag
        let true_z = flag ? this.z : -100000
        BlzSetSpecialEffectHeight(this.handle, true_z)
    }

    get yaw(){return this.__yaw}
    set yaw(yaw: number){
        this.__yaw = yaw
        BlzSetSpecialEffectYaw(this.handle, this.__yaw)
    }

    get pitch(){return this.__pitch}
    set pitch(pitch: number){
        this.__pitch = pitch
        BlzSetSpecialEffectPitch(this.handle, this.__pitch)
    }

    get roll(){return this.__roll}
    set roll(roll: number){
        this.__roll = roll
        BlzSetSpecialEffectRoll(this.handle, this.__roll)
    }

    get scale(){return [this.__scale[0], this.__scale[1], this.__scale[2]]}
    set scale(s: [number, number, number]){
        let s_x = s[0] <= 0.001 ? 0.001 : s[0]
        let s_y = s[1] <= 0.001 ? 0.001 : s[1]
        let s_z = s[2] <= 0.001 ? 0.001 : s[2]
        BlzSetSpecialEffectMatrixScale(this.handle, s_x / this.__scale[0], 
                                                    s_y / this.__scale[1],
                                                    s_z / this.__scale[2])
        this.__scale = [s_x, s_y, s_z]
    }

    get scaleX(){return this.__scale[0]}
    set scaleX(scale: number){
        scale = scale <= 0.002 ? 0.002 : scale
        BlzSetSpecialEffectMatrixScale(this.handle, scale / this.__scale[0], 1, 1)
        this.__scale[0] = scale
    }

    get scaleY(){return this.__scale[1]}
    set scaleY(scale: number){
        scale = scale <= 0.001 ? 0.001 : scale
        BlzSetSpecialEffectMatrixScale(this.handle, 1, scale / this.__scale[1], 1)
        this.__scale[1] = scale
    }

    get scaleZ(){return this.__scale[2]}
    set scaleZ(scale: number){
        scale = scale <= 0.001 ? 0.001 : scale
        BlzSetSpecialEffectMatrixScale(this.handle, 1, 1, scale / this.__scale[2])
        this.__scale[2] = scale
    }

    get color(){return new Color(this.__color)}
    set color(color: Color){
        this.__color = new Color(color)
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

    private __updPos(){
        BlzSetSpecialEffectPosition(this.handle, this.__pos[0],
                                                 this.__pos[1],
                                                 this.__visible ? this.__pos[2] : -10000)
    }

    private __pos: [number, number, number]
    private __visible: boolean
    private __yaw: number
    private __pitch: number
    private __roll: number
    private __scale: [number, number, number]
    private __color: Color
}

type AttachPoint = 'overhead'|'head'|'chest'|'origin'|'hand'|'foot'|'weapon'|'sprite'|'medium'|'large'|'right hand'|'left hand'|'right foot'|'left foot'

export class hEffectAttached extends Handle<jeffect> {
    constructor(model: string, targ: hUnit, point: AttachPoint){
        super(AddSpecialEffectTarget(model , targ.handle, point))
        BlzPlaySpecialEffect(this.handle, ANIM_TYPE_STAND)
        hEffectAttached._is_attached.set(this, true)
    }

    static get(id: jeffect | number){
        let instance = Handle.get(id)
        if (!instance){return}

        if (wcType(instance.handle) != 'effect'){
            Log.err('got wrong type of handle.',
                    __path__, hEffect, 2)
        }

        if (!hEffectAttached._is_attached.get(instance)){
            return
        }

        return instance as hEffect
    }

    destroy(){
        hEffectAttached._is_attached.delete(this)
        BlzSetSpecialEffectScale(this.handle, 0.001)
        DestroyEffect(this.handle)
        super.destroy()
    }

    private static _is_attached = new Map<Handle<jhandle>, boolean>()
}