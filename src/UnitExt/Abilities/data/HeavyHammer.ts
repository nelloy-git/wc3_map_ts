import { IFace } from "../../../../AbilityExt"
import { hImage, hUnit } from "../../../../Handle"
import { Color } from "../../../../Utils"
import { Arc, Line, newImageList } from '../../../../Drawing'

import { AbilData } from "../../../AbilityData"

export class HeavyHammerData extends AbilData {
    constructor(abil: IFace<any>, animation: number|string, range: number, min_angle: number, max_angle: number){
        super(abil)

        this._caster = abil.Data.owner
        this._animation = animation

        this._line_l = new Line(newImageList(200))
        this._line_r = new Line(newImageList(200))
        this._arc_f = new Arc(newImageList(200))
        this._arc_b = new Arc(newImageList(200))

        let x = this._caster.x
        let y = this._caster.y
        this._line_l.setPolarPos(x, y, 48, min_angle, range, min_angle)
        this._line_r.setPolarPos(x, y, 48, max_angle, range, max_angle)
        this._arc_f.setPolarPos(x, y, range, min_angle, max_angle)
        this._arc_b.setPolarPos(x, y, 48, min_angle, max_angle)
    }

    static get = <(buff: IFace<any>) => HeavyHammerData|undefined>AbilData.get

    get progress(){return this._progress}
    set progress(p: number){
        this._progress = p > 1 ? 1 : p < 0 ? 0 : p
    
        let c = new Color(0.5 + 0.5 * p, 0.1, 0.1, 0.3 + 0.7 * p)
        this._line_l.color = c
        this._line_r.color = c
        this._arc_f.color = c
        this._arc_b.color = c
    }

    get animation(){return this._cur_anim}
    set animation(anim: 'START'|'PAUSE'|'END'){
        if (anim == 'START'){
            this._caster.animation = this._animation
            this._caster.animation_scale = 0.8
        } else if (anim == 'PAUSE'){
            this._caster.animation_scale = 0
        } else {
            this._caster.animation_scale = 0.9
        }

        this._cur_anim = anim
    }

    destroy(){
        super.destroy()
        this._caster.animation = 'stand'
        this._caster.animation_scale = 1

        this._line_l.destroy()
        this._line_r.destroy()
        this._arc_f.destroy()
        this._arc_b.destroy()
    }

    private _caster: hUnit
    private _animation: number|string
    private _cur_anim: 'START'|'PAUSE'|'END' = 'END'
    private _progress = -1
    private _line_l: Line<hImage>
    private _line_r: Line<hImage>
    private _arc_f: Arc<hImage>
    private _arc_b: Arc<hImage>
}