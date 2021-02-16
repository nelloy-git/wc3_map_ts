import * as Buff from '../../../Buff'

import { hEffect, hUnit } from "../../../Handle"
import { BuffData } from "./BuffData"

export class StunData extends BuffData {
    constructor(buff: Buff.IFace<any>, model: string){
        super(buff)

        this.target = buff.Data.owner
        this._eff = new hEffect(model, this.target.x, this.target.y, this.target.z)
        this._eff.scaleX = this.target.modelScale / 2
        this._eff.scaleY = this.target.modelScale / 2
        this._eff.scaleZ = this.target.modelScale / 2
    }

    static get = <(buff: Buff.IFace<any>) => StunData>BuffData.get

    period(){
        this._eff.x = this.target.x
        this._eff.y = this.target.y
        this._eff.z = this.target.z
    }

    destroy(){
        super.destroy()
        this._eff.destroy()
    }

    readonly target: hUnit

    private _eff: hEffect
}