import * as Param from "../../../Parameter";

import { IFace } from "../../../AbilityExt"
import { hEffect, hUnit} from "../../../Handle"
import { Arc, Line, newEffectList } from '../../../Drawing'
import { AbilityData } from "./AbilityData"

export class VoodooPoisonData extends AbilityData{
    constructor(abil: IFace<any>, model: string,
                cx: number, cy: number, cz: number,
                r?: number, a?: number, step?: number){
        super(abil)
        r = r ? r : 100
        a = a ? a : 0
        step = step ? step : 16

        this._caster = abil.Data.owner
        this.cx = cx
        this.cy = cy
        this.cz = cz
        this.area = r
        this._angle = a

        this._circle = new Arc(newEffectList(200, model), step)
        this._line1 = new Line(newEffectList(200, model), step)
        this._line2 = new Line(newEffectList(200, model), step)
        this._line3 = new Line(newEffectList(200, model), step)
        this._line4 = new Line(newEffectList(200, model), step)
        
        this._circle.z = cz
        this._line1.z = cz
        this._line2.z = cz
        this._line3.z = cz
        this._line4.z = cz

        this._line1.visible = false
        this._line2.visible = false
        this._line3.visible = false
        this._line4.visible = false

        this._progress = 0
        this.progress = 0
    }

    static get = <(abil: IFace<any>) => VoodooPoisonData>AbilityData.get

    get progress(){return this._progress}
    set progress(p: number){
        p = p > 0.95 ? 1 : p < 0 ? 0 : p

        let pi = math.pi
        let cx = this.cx
        let cy = this.cy
        let r = this.area
        let a = this._angle

        this._circle.setPolarPos(cx, cy, r, 0, p * 2 * pi)
        if (p > 0.95 && !this._line1.visible){
            this._line1.visible = true
            this._line2.visible = true
            this._line3.visible = true
            this._line4.visible = true
            this._line1.setPolarPos(cx, cy, r, 1/4 * pi + a, 0.65 * r, 3/2 * pi + a)
            this._line2.setPolarPos(cx, cy, r, 3/4 * pi + a, 0.65 * r, 3/2 * pi + a)
            this._line3.setPolarPos(cx, cy, r, 5/4 * pi + a, 0.65 * r, 1/2 * pi + a)
            this._line4.setPolarPos(cx, cy, r, 7/4 * pi + a, 0.65 * r, 1/2 * pi + a)
        }
    }

    dealDamage(targ: hUnit, dmg: number){
        let list = hUnit.getInRange(this.cx, this.cy, this.area)
        list.forEach(targ => {
            if (targ.isAlly(this._caster)){return}
            Param.Damage.deal(this._caster, targ, dmg, 'MSPL')
        })
    }

    unregister(){
        super.destroy()
    }

    destroy(){
        this._circle.destroy()
        this._line1.destroy()
        this._line2.destroy()
        this._line3.destroy()
        this._line4.destroy()
    }

    time: number = 0
    readonly cx: number
    readonly cy: number
    readonly cz: number
    readonly area: number

    private _caster: hUnit
    private _progress: number
    private _angle: number

    private _circle: Arc<hEffect>
    private _line1: Line<hEffect>
    private _line2: Line<hEffect>
    private _line3: Line<hEffect>
    private _line4: Line<hEffect>
}