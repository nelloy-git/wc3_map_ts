import * as Buff from '../../../Buff'

import { hEffect, hUnit } from "../../../Handle"
import { Vec3 } from '../../../Utils'
import { DurationData } from "../DurationData"

export class Stun extends DurationData {
    constructor(buff: Buff.IFace<any>, model: string){
        super(buff)

        this.target = buff.Data.owner

        let v = new Vec3(this.target.x, this.target.y, this.target.z)
        this._eff = new hEffect(model, v)
        this._eff.scaleX = this.target.modelScale / 2
        this._eff.scaleY = this.target.modelScale / 2
        this._eff.scaleZ = this.target.modelScale / 2
    }

    static get = <(buff: Buff.IFace<any>) => Stun>DurationData.get

    period(){
        this._eff.x = this.target.x
        this._eff.y = this.target.y
        this._eff.z = this.target.z
    }

    detach(){
        super.detach()
        this._eff.destroy()
    }

    readonly target: hUnit

    private _eff: hEffect
}