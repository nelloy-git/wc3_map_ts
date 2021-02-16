import * as Buff from '../../../Buff'

import { hUnit } from "../../../Handle"
import { BuffData } from "./BuffData"

export class TossUpData extends BuffData {
    constructor(buff: Buff.IFace<any>, height: number){
        super(buff)

        this.target = buff.Data.owner
        let dt = Buff.period

        let t = (buff.Dur.Timer.fullTime / 2) / dt 
        this._acc = -height / (t * t)
        this._vel = -this._acc * t
    }

    static get = <(buff: Buff.IFace<any>) => TossUpData>BuffData.get

    period(){
        this._vel += this._acc
        this.target.z += this._vel
    }

    readonly target: hUnit

    private _vel: number
    private _acc: number
}