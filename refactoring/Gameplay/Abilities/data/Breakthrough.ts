import * as Abil from "../../../AbilityExt";
import * as Handle from '../../../../src/Handle'
import { Vec2 } from '../../../../src/Utils'

import { IFace } from "../../../AbilityExt"
import { CastingData } from "../CastingData"
import { Move } from "../../utils/Move";

const dt = Abil.Casting.period

export class Breakthrough extends CastingData{
    constructor(abil: IFace<[Vec2]>, caster: Handle.hUnit, target: Vec2){
        super(abil)
        
        this.caster = caster
        this.target = target

        let delta = target.sub(caster.pos)
        this.angle = delta.angle
        
        let cast_time = abil.Casting.castingTime([target])
        let turn_time = 0.5 * Math.min(this.angle, 2 * math.pi - this.angle) / math.pi
        let run_time = cast_time - turn_time
        let vel = delta.mult(dt / run_time)

        this.__move = new Move(caster, vel)
        this.vel = this.__move.vel
    } 

    static get = <(abil: IFace<[Vec2]>) => Breakthrough> CastingData.get

    move(){
        let pos = this.__move.move()
        if (!pos){
            return Breakthrough.Status.COLLISION
        }

        let vel = this.__move.vel
        let delta = this.target.sub(pos)
        let abs = math.abs
        if (abs(delta.x) < abs(vel.x) || abs(delta.y) < abs(vel.y)){
            return Breakthrough.Status.FINISHED
        }

        return Breakthrough.Status.OK
    }

    pushed: Handle.hUnit[] = []

    readonly caster: Handle.hUnit
    readonly target: Vec2
    readonly vel: Vec2
    readonly angle: number

    private __move: Move
}

export namespace Breakthrough{
    export enum Status {
        OK,
        COLLISION,
        FINISHED
    }
}