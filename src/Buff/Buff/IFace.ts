import { hTimerObj, hUnit } from "../../Handle";

export interface DataIFace<T> {
    readonly id: number
    readonly owner: hUnit
    readonly source: hUnit
    readonly buff: IFace<T>
    user_data: T

    readonly name: string
    readonly icon: string
    readonly tooltip: string
    readonly stackable: boolean
    readonly add_duration: boolean
}

export interface DurationIFace<T> {
    readonly buff: IFace<T>
    readonly Timer: hTimerObj
    readonly period: number

    extraPeriod(reduce_time_left: boolean): void
    cancel(): void
    finish(): void
    addStack(other: IFace<T>): void
}

export interface IFace<T> {
    readonly Data: DataIFace<T>
    readonly Dur: DurationIFace<T>
}

export namespace IFace {
    let _id2buff = new Map<number, IFace<any>>()

    let _last_id = 0
    export function register(iface: IFace<any>){
        _last_id++ 
        _id2buff.set(_last_id, iface)
        return _last_id
    }

    export function get(id: number){
        return _id2buff.get(id)
    }
}