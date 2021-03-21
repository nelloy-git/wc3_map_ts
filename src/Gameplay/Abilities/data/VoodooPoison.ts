import * as Param from "../../../Parameter";

import { IFace, TargetType } from "../../../AbilityExt"
import { hEffect, hUnit} from "../../../Handle"
import { Arc, Line, newEffectList } from '../../../Drawing'
import { CastingData } from "./CastingData"
import { Vec2 } from "../../../Utils";

const MODEL = 'Abilities\\Spells\\Items\\OrbVenom\\OrbVenomMissile.mdl'
const HEIGHT = -40
const STEP = 16

export class VoodooPoisonData extends CastingData{
    constructor(abil: IFace<TargetType[]>,
                caster: hUnit, target: Vec2, area: number){
        super(abil)

        this.caster = caster
        this.target = target.copy()
        this.area = area
        this.__visible = false

        this.__progress = 0
        this.__circle = new Arc(newEffectList(200, MODEL), STEP, HEIGHT)
        this.__line1 = new Line(newEffectList(200, MODEL), STEP, HEIGHT)
        this.__line2 = new Line(newEffectList(200, MODEL), STEP, HEIGHT)
        this.__line3 = new Line(newEffectList(200, MODEL), STEP, HEIGHT)
        this.__line4 = new Line(newEffectList(200, MODEL), STEP, HEIGHT)

        this.progress = 0
    }

    static get = <(abil: IFace<TargetType[]>) => VoodooPoisonData>CastingData.get

    get progress(){return this.__progress}
    set progress(p: number){
        p = p > 0.95 ? 1 : p < 0 ? 0 : p

        this.__circle.setPolarPos(this.target, this.area, 0, p * 2 * math.pi)
        if (p > 0.95 && !this.__visible){
            this.__visible = true
            let delta = this.target.sub(this.caster.pos)
            let a = delta.angle
            let pi = math.pi

            this.__line1.setPolarPos(this.target, this.area,
                                     1/4 * pi + a, 0.65 * this.area, 3/2 * pi + a)
            this.__line2.setPolarPos(this.target, this.area,
                                     3/4 * pi + a, 0.65 * this.area, 3/2 * pi + a)
            this.__line3.setPolarPos(this.target, this.area,
                                     5/4 * pi + a, 0.65 * this.area, 1/2 * pi + a)
            this.__line4.setPolarPos(this.target, this.area,
                                     7/4 * pi + a, 0.65 * this.area, 1/2 * pi + a)
        }
    }

    detach(){
        super.destroy()
    }

    destroy(){
        this.__circle.destroy()
        this.__line1.destroy()
        this.__line2.destroy()
        this.__line3.destroy()
        this.__line4.destroy()
    }

    time: number = 0
    readonly caster: hUnit
    readonly target: Vec2
    readonly area: number

    private __progress: number
    private __visible: boolean
    private __circle: Arc<hEffect>
    private __line1: Line<hEffect>
    private __line2: Line<hEffect>
    private __line3: Line<hEffect>
    private __line4: Line<hEffect>
}