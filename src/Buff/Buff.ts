import { hUnit } from "../Handle";
import { EventActions } from "../Utils";
import { Data } from "./Data/Instance";
import { Duration } from "./Duration/Instance";

import type { TBuff } from './TBuff'

export class Buff<T> {
    constructor(source: hUnit, owner: hUnit, type: TBuff<T>, user_data: T){
        this.id = Buff.__register(this)
        this.owner = owner
        this.source = source
        this.type = type
        this.Data = new Data(this, type.TData, user_data)
        this.Dur = new Duration(this, type.TDuration)
        this.actions = new EventActions(<Buff<T>>this, this.toString())

        this.Dur.actions.add('START', () => {this.actions.run('START')})
        this.Dur.actions.add('LOOP', () => {this.actions.run('LOOP')})
        this.Dur.actions.add('CANCEL', () => {this.actions.run('CANCEL')})
        this.Dur.actions.add('FINISH', () => {this.actions.run('FINISH')})
    }

    destroy(){
        Buff.__id2buff.delete(this.id)
        this.Dur.destroy()
    }

    readonly id: number
    readonly owner: hUnit
    readonly source: hUnit
    readonly type: TBuff<T>
    readonly Data: Data<T>
    readonly Dur: Duration<T>
    readonly actions: EventActions<Buff.Event, Buff<T>>

    private static __id2buff = new Map<number, Buff<any>>()
    private static __last_id = 0
    private static __register(buff: Buff<any>){
        Buff.__last_id++
        Buff.__id2buff.set(this.__last_id, buff)
        return Buff.__last_id
    }
}

export namespace Buff {
    export type Event = 'START' | 'LOOP' | 'CANCEL' | 'FINISH'
}