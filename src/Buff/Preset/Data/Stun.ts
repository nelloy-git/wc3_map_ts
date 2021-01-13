import { hEffect, hUnit } from "../../../Handle"
import { IFace } from "../../Buff/IFace"
import { BuffData } from "./Data"

export class StunData extends BuffData {
    constructor(buff: IFace<any>, model: string){
        super(buff)

        this.target = buff.Data.owner
        this._eff = new hEffect(model, this.target.x, this.target.y, this.target.z)
        this._eff.scaleX = this.target.modelScale / 2
        this._eff.scaleY = this.target.modelScale / 2
        this._eff.scaleZ = this.target.modelScale / 2
    }

    static get = <(buff: IFace<any>) => StunData|undefined>BuffData.get

    move(){
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