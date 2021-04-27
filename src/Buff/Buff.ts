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

        this.actions = new EventActions(this.toString())
        this.actions.link(Buff.__duration_event_map, this.Dur.actions)
        Buff.actions.link(Buff.__global_event_map, this.actions)

        // this.Dur.actions.add('START', () => {this.__runActions('START')})
        // this.Dur.actions.add('LOOP', () => {this.__runActions('LOOP')})
        // this.Dur.actions.add('CANCEL', () => {this.__runActions('CANCEL')})
        // this.Dur.actions.add('FINISH', () => {this.__runActions('FINISH')})
    }

    toString(){
        return this.constructor.name + '<' + this.Data.name + ':' + this.id.toString() + '>'
    }

    destroy(){
        this.Dur.destroy()
        Buff.__id2buff.delete(this.id)
    }

    private __runActions(event: Buff.Event){
        Buff.actions.run(event, this)
        this.actions.run(event, this)
    }

    readonly id: number
    readonly owner: hUnit
    readonly source: hUnit
    readonly type: TBuff<T>
    readonly Data: Data<T>
    readonly Dur: Duration<T>
    readonly actions: EventActions<Buff.Event, [Buff<T>]>

    private static __id2buff = new Map<number, Buff<any>>()
    private static __last_id = 0
    private static __register(buff: Buff<any>){
        Buff.__last_id++
        Buff.__id2buff.set(this.__last_id, buff)
        return Buff.__last_id
    }

    private static __global_event_map = new Map<Buff.Event, Buff.Event>([
        ['START', 'START'],
        ['LOOP', 'LOOP'],
        ['CANCEL', 'CANCEL'],
        ['FINISH', 'FINISH'],
    ])

    private static __duration_event_map = new Map<Duration.Event, Buff.Event>([
        ['START', 'START'],
        ['LOOP', 'LOOP'],
        ['CANCEL', 'CANCEL'],
        ['FINISH', 'FINISH'],
    ])
}

export namespace Buff {
    export type Event = 'START' | 'LOOP' | 'CANCEL' | 'FINISH'
    
    export const actions = new EventActions<Buff.Event,
                                            [Buff<any>]>
                                            (Buff.name)
}