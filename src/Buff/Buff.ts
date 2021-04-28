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
        this.Dur.actions.link(Buff.__duration_event_map, this.actions, () => {return [this]})
        this.actions.link(Buff.__global_event_map, Buff.actions)
    }

    toString(){
        return this.constructor.name + '<' + this.Data.name + ':' + this.id.toString() + '>'
    }

    destroy(){
        this.actions.destroy()
        this.Dur.destroy();

        (<any>this.id) = undefined;
        (<any>this.owner) = undefined;
        (<any>this.source) = undefined;
        (<any>this.type) = undefined;
        (<any>this.Data) = undefined;
        (<any>this.Dur) = undefined;
        (<any>this.actions) = undefined;
        Buff.__id2buff.delete(this.id)
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

    private static readonly __global_event_map: ReadonlyMap<Buff.Event, Buff.Event> = new Map([
        ['START', 'START'],
        ['FAIL', 'FAIL'],
        ['LOOP', 'LOOP'],
        ['CANCEL', 'CANCEL'],
        ['FINISH', 'FINISH'],
    ])

    private static readonly __duration_event_map: ReadonlyMap<Duration.Event, Buff.Event> = new Map([
        ['START', 'START'],
        ['FAIL', 'FAIL'],
        ['LOOP', 'LOOP'],
        ['CANCEL', 'CANCEL'],
        ['FINISH', 'FINISH'],
    ])
}

export namespace Buff {
    export type Event = 'START' | 'FAIL' | 'LOOP' | 'CANCEL' | 'FINISH'
    
    export const actions = new EventActions<Buff.Event,
                                            [Buff<any>]>
                                            (Buff.name)
}