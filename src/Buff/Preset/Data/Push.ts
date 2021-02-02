import { hUnit } from "../../../Handle"
import { isWalkable } from "../../../Utils"
import { IFace } from "../../Buff/IFace"
import { BuffData } from "./Data"

export class PushData extends BuffData {
    constructor(buff: IFace<any>, vel_x: number, vel_y: number, dur: number, dt: number){
        super(buff)
        
        this.target = buff.Data.owner
        this.dt = dt
        this._vel_x = vel_x * dt
        this._vel_y = vel_y * dt
        this.acc_x = -this._vel_x * dt / dur
        this.acc_y = -this._vel_y * dt / dur
    }

    static get = <(buff: IFace<any>) => PushData|undefined>BuffData.get

    move(): 'OK'|'COLLISION'|'FINISH'{
        let x = this.target.x + this._vel_x
        let y = this.target.y + this._vel_y

        if (isWalkable(x, y)){
            return 'COLLISION'
        }

        this.target.x = x
        this.target.y = y

        this._vel_x += this.acc_x
        this._vel_y += this.acc_y

        if (math.abs(this._vel_x) <= math.abs(this.acc_x) || 
            math.abs(this._vel_y) <= math.abs(this.acc_y)){
            return 'FINISH'
        }

        return 'OK'
    }

    readonly target: hUnit
    readonly dt: number
    readonly acc_x: number
    readonly acc_y: number
    get vel_x(){return this._vel_x}
    get vel_y(){return this._vel_y}

    private _vel_x: number
    private _vel_y: number
}