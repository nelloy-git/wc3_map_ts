import { hUnit } from "../../../Handle"
import { IFace } from "../../Buff/IFace"
import { BuffData } from "./Data"

export class TossUpData extends BuffData {
    constructor(buff: IFace<any>, height: number, dur: number, dt: number){
        super(buff)

        this.target = buff.Data.owner
        this._dt = dt

        let t = (dur / 2) / dt 
        this._acc = -height / (t * t)
        this._vel = -this._acc * t
        print(this._vel, this._acc)
    }

    static get = <(buff: IFace<any>) => TossUpData|undefined>BuffData.get

    move(){
        this._vel += this._acc
        this.target.z += this._vel
    }

    readonly target: hUnit

    private _dt: number
    private _vel: number
    private _acc: number
}