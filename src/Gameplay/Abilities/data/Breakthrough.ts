import * as Abil from "../../../AbilityExt";
import * as Handle from '../../../Handle'
import * as Utils from '../../../Utils'

import { IFace } from "../../../AbilityExt"
import { isWalkable } from "../../../Utils"
import { CastingData } from "./CastingData"

const dt = Abil.Casting.period

export class BreakthroughData extends CastingData{
    constructor(abil: IFace<[Utils.Vec2]>, caster: Handle.hUnit, target: Utils.Vec2){
        super(abil)
        
        this.caster = caster
        this.target = target

        let delta = target.sub(caster.pos)
        this.angle = delta.angle
        
        let cast_time = abil.Casting.castingTime([target])
        let turn_time = 0.5 * Math.min(this.angle, 2 * math.pi - this.angle) / math.pi
        let run_time = cast_time - turn_time
        this.vel = delta.mult(dt / run_time)
        this._status = 'OK'
    } 

    static get = <(abil: IFace<[Utils.Vec2]>) => BreakthroughData> CastingData.get

    period(){
        let pos = this.caster.pos.add(this.vel)

        if (isWalkable(pos)){
            this._status = 'COLLISION'
            return
        }

        this.caster.pos = pos
        let delta = this.target.sub(pos)

        let abs = math.abs
        if (abs(delta.x) < abs(this.vel.x) || abs(delta.y) < abs(this.vel.y)){
            this._status = 'FINISH'
            return
        }

        return
    }

    pushed: Handle.hUnit[] = []

    readonly caster: Handle.hUnit
    readonly target: Utils.Vec2
    readonly angle: number
    readonly vel: Utils.Vec2
    get status(){return this._status}

    private _status: 'OK'|'COLLISION'|'FINISH'
}