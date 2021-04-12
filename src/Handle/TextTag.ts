import { Vec2, Vec3 } from "../Math";
import { Color } from "../Utils";
import { Handle } from "./Handle";

export class hTextTag extends Handle<jtexttag> {
    constructor(){
        super(CreateTextTag())

        this.__pos = new Vec3(0, 0, 0)
        this.__vel = new Vec2(0, 0)
        this.__text = ''
        this.__font_size = 12
        this.__color = new Color()
        this.__visible = true
        this.__permanent = false
        this.__fadepoint = 0
    }

    static get(id: jtexttag | number){
        return Handle.get(id, 'textjtexttag') as hTextTag | undefined
    }

    static Timed(text: string, size: number, color: Color,
                 pos: Vec3, vel: Vec2, lifetime: number){
        let tt = CreateTextTag()
        SetTextTagText(tt, text, 0.0023 * size)
        SetTextTagColor(tt, color.r, color.g, color.b, color.a)
        SetTextTagPos(tt, pos.x, pos.y, pos.z)
        SetTextTagVelocity(tt, vel.x, vel.y)
        SetTextTagPermanent(tt, false)
        SetTextTagLifespan(tt, lifetime)
        SetTextTagFadepoint(tt, 0)
    }

    get pos(){return this.__pos.copy()}
    set pos(v: Vec3){
        this.__pos = v.copy()
        SetTextTagPos(this.handle, v.x, v.y, v.z)
    }

    get text(){return this.__text}
    set text(text: string){
        this.__text = text
        SetTextTagText(this.handle, text, 0.0023 * this.__font_size)
    }

    get fontSize(){return this.__font_size}
    set fontSize(size: number){
        this.__font_size = size
        SetTextTagText(this.handle, this.__text, 0.0023 * size)
    }

    get color(){return this.__color.copy()}
    set color(color: Color){
        this.__color = color.copy()
        SetTextTagColor(this.handle, color.r, color.g, color.b, color.a)
    }

    get velocity(){return this.__vel.copy()}
    set velocity(v: Vec2){
        this.__vel = v.copy()
        SetTextTagVelocity(this.handle, v.x, v.y)
    }
    
    get visible(){return this.__visible}
    set visible(flag: boolean){
        this.__visible = flag
        SetTextTagVisibility(this.handle, flag)
    }

    get fadepoint(){return this.__fadepoint}
    set fadepoint(val: number){
        this.__fadepoint = val
        SetTextTagFadepoint(this.handle, val)
    }

    get permanent(){return this.__permanent}
    set permanent(flag: boolean){
        this.__permanent = flag
        SetTextTagPermanent(this.handle, flag)
    }

    destroy(){
        DestroyTextTag(this.handle)
        super.destroy()
    }

    private __pos: Vec3
    private __vel: Vec2
    private __text: string
    private __font_size: number
    private __color: Color
    private __visible: boolean
    private __permanent: boolean
    private __fadepoint: number
}