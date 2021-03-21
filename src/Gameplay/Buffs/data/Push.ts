import * as Buff from '../../../Buff'

import { hUnit } from "../../../Handle"
import { isWalkable, Vec2 } from "../../../Utils"
import { BuffData } from "./BuffData"

export class PushData extends BuffData {
    constructor(buff: Buff.IFace<any>, vel:[vel: Vec2]){
        super(buff)
        
        this.target = buff.Data.owner
        this.__status = 'OK'

        const dt = Buff.period
        this.__vel = vel[0].mult(dt)
        this.__acc = this.__vel.mult(-dt / buff.Dur.Timer.fullTime)
    }

    static get = <(buff: Buff.IFace<any>) => PushData>BuffData.get

    period(){
        let pos = this.target.pos.add(this.__vel)

        if (isWalkable(pos)){
            this.__status = 'COLLISION'
            return
        }

        this.target.pos = pos
        this.__vel = this.__vel.add(this.__acc)

        let abs = math.abs
        if (abs(this.__vel.length) <= abs(this.__acc.length)){
            this.__status = 'FINISH'
            return
        }

        return
    }
    
    readonly target: hUnit

    get status(){return this.__status}
    get vel(){return this.__vel.copy}

    private __status: 'OK'|'COLLISION'|'FINISH'
    private __vel: Vec2
    private __acc: Vec2
}