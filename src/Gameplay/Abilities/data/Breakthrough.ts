import * as Abil from "../../../AbilityExt";

import { IFace } from "../../../AbilityExt"
import { hUnit } from "../../../Handle"
import { deltaPos, getAngle, getTurnTime, isWalkable } from "../../../Utils"
import { AbilityData } from "./AbilityData"

const dt = Abil.Casting.period

export class BreakthroughData extends AbilityData{
    constructor(abil: IFace<any>, caster: hUnit, target: Abil.Point){
        super(abil)
        
        this.caster = caster
        let [dx, dy] = deltaPos(target, caster)
        this.range = SquareRoot(dx * dx + dy * dy)
        this.angle = getAngle(caster, target)
        
        let cast_time = abil.Casting.castingTime(target)
        let turn_time = getTurnTime(caster, target)
        let run_time = cast_time - turn_time
        this.vel = this.range / run_time

        this.vel_x = this.vel * Cos(this.angle) * dt
        this.vel_y = this.vel * Sin(this.angle) * dt
        this._abs_vel_x = math.abs(this.vel_x)
        this._abs_vel_y = math.abs(this.vel_y)
        this._range_x = math.abs(this.range * Cos(this.angle))
        this._range_y = math.abs(this.range * Sin(this.angle))
        this._status = 'OK'
    }

    static get = <(abil: IFace<any>) => BreakthroughData> AbilityData.get

    // Returns false if finished.
    period(){
        let x = this.caster.x + this.vel_x
        let y = this.caster.y + this.vel_y

        if (isWalkable(x, y)){
            this._status = 'COLLISION'
            return
        }

        this.caster.x = x
        this.caster.y = y

        this._range_x -= this._abs_vel_x
        this._range_y -= this._abs_vel_y

        if (this._range_x <= 0 || this._range_y <= 0){
            this._status = 'FINISH'
            return
        }

        return
    }

    targets: hUnit[] = []

    readonly caster: hUnit
    readonly angle: number
    readonly vel: number
    readonly vel_x: number
    readonly vel_y: number
    readonly range: number
    get status(){return this._status}
    get range_x(){return this._range_x}
    get range_y(){return this._range_y}

    private _status: 'OK'|'COLLISION'|'FINISH'
    private _range_x: number
    private _range_y: number
    private _abs_vel_x: number
    private _abs_vel_y: number
}