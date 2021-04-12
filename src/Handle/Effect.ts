import { hUnit } from "./Unit";
import { Color, getFilePath, Log, wcType, Vec3 } from "../Utils";
import { Handle } from "./Handle";

let __path__ = Macro(getFilePath())

export class hEffect extends Handle<jeffect> {
    constructor(model: string){
        super(AddSpecialEffect(model, 0, 0))
        BlzSetSpecialEffectHeight(this.handle, 0)
        BlzPlaySpecialEffect(this.handle, ANIM_TYPE_STAND)
        
        this.__pos = new Vec3(0, 0, 0)
        this.__scale = new Vec3(1, 1, 1)
        this.__yaw = 0
        this.__pitch = 0
        this.__roll = 0

        this.__visible = true
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

    get pos(){return this.__pos.copy()}
    set pos(v: Vec3){
        this.__pos = v.copy()
        BlzSetSpecialEffectPosition(this.handle, this.__pos.x,
                                                 this.__pos.y,
                                                 this.__visible ? this.__pos.z : -10000)
    }

    get scale(){return this.__scale.copy()}
    set scale(v: Vec3){
        v.x = v.x < 0.001 ? 0.001 : v.x
        v.y = v.y < 0.001 ? 0.001 : v.y
        v.z = v.z < 0.001 ? 0.001 : v.z
        BlzSetSpecialEffectMatrixScale(this.handle, v.x / this.__scale.x, 
                                                    v.y / this.__scale.y,
                                                    this.__visible ? v.z / this.__scale.z : -100000)
        this.__scale = v.copy()
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
    
    get visible(){return this.__visible}
    set visible(flag: boolean){
        this.__visible = flag
        let true_z = flag ? this.__pos.z : -100000
        BlzSetSpecialEffectHeight(this.handle, true_z)
    }

    get color(){return this.__color.copy()}
    set color(color: Color){
        this.__color = color.copy()
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

    private __pos: Vec3
    private __scale: Vec3
    private __yaw: number
    private __pitch: number
    private __roll: number

    private __visible: boolean
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