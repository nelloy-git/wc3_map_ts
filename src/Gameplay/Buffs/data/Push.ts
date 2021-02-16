import * as Buff from '../../../Buff'

import { hUnit } from "../../../Handle"
import { isWalkable } from "../../../Utils"
import { BuffData } from "./BuffData"

export class PushData extends BuffData {
    constructor(buff: Buff.IFace<any>, vel:[x: number, y: number]){
        super(buff)
        
        this._target = buff.Data.owner
        this._status = 'OK'

        let dt = Buff.period
        let [vel_x, vel_y] = vel
        this._vel_x = vel_x * dt
        this._vel_y = vel_y * dt
        this._acc_x = -this._vel_x * dt / buff.Dur.Timer.fullTime
        this._acc_y = -this._vel_y * dt / buff.Dur.Timer.fullTime
    }

    static get = <(buff: Buff.IFace<any>) => PushData>BuffData.get

    period(){
        let x = this._target.x + this._vel_x
        let y = this._target.y + this._vel_y

        if (isWalkable(x, y)){
            this._status = 'COLLISION'
            return
        }

        this._target.x = x
        this._target.y = y

        this._vel_x += this._acc_x
        this._vel_y += this._acc_y

        if (math.abs(this._vel_x) <= math.abs(this._acc_x) || 
            math.abs(this._vel_y) <= math.abs(this._acc_y)){
            
            this._status = 'FINISH'
            return
        }

        return
    }

    get status(){return this._status}
    get vel_x(){return this._vel_x}
    get vel_y(){return this._vel_y}

    private _target: hUnit
    private _status: 'OK'|'COLLISION'|'FINISH'
    private _vel_x: number
    private _vel_y: number
    private _acc_x: number
    private _acc_y: number
}