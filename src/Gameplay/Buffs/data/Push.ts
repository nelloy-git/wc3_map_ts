import * as Buff from '../../../Buff'

import { hUnit } from "../../../Handle"
import { isWalkable, Vec2 } from "../../../Utils"
import { Move } from '../../utils/Move'
import { DurationData } from "../DurationData"

const dt = Buff.period

export class Push extends DurationData {
    constructor(buff: Buff.IFace<any>, target: hUnit, vel: Vec2){
        super(buff)
        
        this.target = target
        let loop_vel = vel.mult(dt)
        let loop_acc = loop_vel.mult(-dt / buff.Dur.Timer.fullTime)

        this.__move = new Move(target, loop_vel, loop_acc)
    }

    static get = <(buff: Buff.IFace<any>) => Push>DurationData.get

    move(){
        let pos = this.__move.move()
        if (!pos){
            return Push.Status.COLLISION
        }

        let vel = this.__move.vel
        let acc = <Vec2>this.__move.acc

        let abs = math.abs
        if (abs(vel.x) < abs(acc.x) || abs(vel.y) < abs(acc.y)){
            return Push.Status.FINISHED
        }
        return Push.Status.OK
    }
    
    readonly target: hUnit

    private __move: Move
}

export namespace Push{
    export enum Status {
        OK,
        COLLISION,
        FINISHED
    }
}