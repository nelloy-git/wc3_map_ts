import { IFace, TargetType } from "../../../AbilityExt"
import { hImage, hUnit } from "../../../Handle"
import { Color, Vec2 } from "../../../Utils"
import { Arc, Line, newImageList } from '../../../Drawing'

import { CastingData } from "../CastingData"

export class HeavyHammerData extends CastingData {
    constructor(abil: IFace<TargetType[]>, caster: hUnit, target: Vec2, width: number){
        super(abil)

        this._line_l = new Line(newImageList(200))
        this._line_r = new Line(newImageList(200))
        this._arc_f = new Arc(newImageList(200))
        this._arc_b = new Arc(newImageList(200))

        let c = caster.pos
        let delta = target.sub(c)
        let range = delta.length
        let min_angle = delta.angle - width / 2
        let max_angle = delta.angle + width / 2

        this._line_l.setPolarPos(c, 48, min_angle, range, min_angle)
        this._line_r.setPolarPos(c, 48, max_angle, range, max_angle)
        this._arc_f.setPolarPos(c, range, min_angle, max_angle)
        this._arc_b.setPolarPos(c, 48, min_angle, max_angle)
    }

    static get = <(buff: IFace<TargetType[]>) => HeavyHammerData>CastingData.get

    get progress(){return this._progress}
    set progress(p: number){
        this._progress = p > 1 ? 1 : p < 0 ? 0 : p
    
        let c = new Color(0.5 + 0.5 * p, 0.1, 0.1, 0.1 + 0.1 * p)
        this._line_l.color = c
        this._line_r.color = c
        this._arc_f.color = c
        this._arc_b.color = c
    }

    destroy(){
        this._line_l.destroy()
        this._line_r.destroy()
        this._arc_f.destroy()
        this._arc_b.destroy()

        super.destroy()
    }

    cur_anim: 'START'|'PAUSE'|'END' = 'END'

    private _progress = -1
    private _line_l: Line<hImage>
    private _line_r: Line<hImage>
    private _arc_f: Arc<hImage>
    private _arc_b: Arc<hImage>
}