import * as Handle from '../../Handle'
import * as Utils from '../../Utils'

import { Charges } from "./Charges";

export type TargetType = Handle.hUnit | Utils.Vec2

export interface DataIFace<T extends TargetType[]> {
    readonly id: number
    readonly owner: Handle.hUnit
    readonly abil: IFace<T>
    
    readonly name: string
    readonly icon_normal: string
    readonly icon_disabled: string
    readonly tooltip: string
    readonly life_cost: number
    readonly mana_cost: number
    readonly range: number
    readonly area: number
    readonly charges_use: number
    readonly charges_max: number
    readonly charge_cd: number
    readonly is_available: boolean
    consume(target: T): boolean
    
    readonly Charges: Charges
}

export interface TargetingIFace<T extends TargetType[]> {
    readonly abil: IFace<T>

    start(pl: jplayer): void
    cancel(pl: jplayer): void
    finish(pl: jplayer, target?: T): void
}

export interface CastingIFace<T extends TargetType[]> {
    readonly abil: IFace<T>
    readonly period: number
    readonly Timer: Handle.hTimerObj

    start(target: T): void
    extraPeriod(reduce_time_left: boolean): void
    cancel(): void
    interrupt(): void
    finish(): void

    castingTime(target: T | undefined): number
    isTargetValid(target: T): boolean
}

export interface IFace<T extends TargetType[]> {
    readonly Casting: CastingIFace<T>
    readonly Data: DataIFace<T>
    readonly Targeting: TargetingIFace<T>
}

export namespace IFace {
    let _id2abil = new Map<number, IFace<TargetType[]>>()

    let _last_id = 0
    export function register(iface: IFace<TargetType[]>){
        _last_id++ 
        _id2abil.set(_last_id, iface)
        return _last_id
    }

    export function get(id: number){
        return _id2abil.get(id)
    }
}