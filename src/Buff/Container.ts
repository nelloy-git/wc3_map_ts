import { hUnit } from "../Handle";
import { Action, EventActions, log } from "../Utils";

import { Buff } from './Buff'
import type { TBuff } from './TBuff'

export class BuffContainer {
    constructor(owner: hUnit){
        this.owner = owner
        this.actions = new EventActions(this.toString())
        this.__list = []
        this.__list_actions = new Map()
        this.__buff_event_mapped = new Map([
            ['START', (event, buff) => {this.__runBuffEvent(event, buff)}],
            ['LOOP', (event, buff) => {this.__runBuffEvent(event, buff)}],
            ['CANCEL', (event, buff) => {this.__runBuffEvent(event, buff)}],
            ['FINISH', (event, buff) => {this.__runBuffEvent(event, buff)}]
        ])

        if (BuffContainer.__owner2container.get(owner)){
            error(BuffContainer.name + ': buff container already exists.', 2)
        }
        BuffContainer.__owner2container.set(owner, this)
    }

    static get(owner: hUnit | undefined){
        if (!owner){
            return undefined
        }
        return BuffContainer.__owner2container.get(owner)
    }

    toString(){
        return this.owner.toString() + '.' + this.constructor.name
    }
    
    get list(): ReadonlyArray<Buff<any>>{
        return this.__list
    }

    add<T>(src: hUnit, dur: number, type: TBuff<T>, user_data: T){
        let buff = new Buff<T>(src, this.owner, type, user_data)

        let stacked = false
        for (let i = 0; i < this.__list.length; i++){
            let base = this.__list[i]
            if (base.type == buff.type && buff.Data.stackable(base)){
                base.Dur.addStack(buff)
                stacked = true
            }
        }

        if (!stacked){
            buff.actions.addMap(this.__buff_event_mapped)
            this.__list.push(buff)
            buff.Dur.start(dur)
        } else {
            buff.destroy()
        }
    }

    remove(buff_or_pos: Buff<any> | number | undefined, event?: 'CANCEL' | 'FINISH'){
        if (!buff_or_pos){
            return false
        }

        let pos: number
        if (typeof buff_or_pos === 'number'){
            pos = buff_or_pos
        } else {
            pos = this.__list.indexOf(buff_or_pos)
            if (pos < 0){
                return false
            }
        }

        const [buff] = this.__list.splice(pos, 1)
        if (event){
            if (event == 'CANCEL'){
                buff.Dur.cancel()
            } else {
                buff.Dur.finish()
            }
        } else {
            buff.destroy()
        }
        return true
    }

    get(i: number): Buff<any> | undefined{
        return this.__list[i]
    }

    destroy(){
        for (let i = 0; i < this.__list.length; i++){
            this.remove(i)
        }
        BuffContainer.__owner2container.delete(this.owner);
    }

    private __runBuffEvent(event: BuffContainer.Event, buff: Buff<any>){
        let remove = event == 'CANCEL' || event == 'FINISH'
        if (remove){
            let pos = this.__list.indexOf(buff)
            this.__list.splice(pos, 1)
        }

        BuffContainer.actions.run(event, this, buff)
        this.actions.run(event, this, buff)

        if (remove){
            buff.destroy()
        }
    }

    readonly owner: hUnit
    readonly actions: EventActions<BuffContainer.Event, [BuffContainer, Buff<any>]>

    private __list: Buff<any>[]
    private __list_actions: Map<Buff<any>, Action<[Buff.Event, Buff<any>]>[]>

    private readonly __buff_event_mapped: Map<Buff.Event, (event: Buff.Event, buff: Buff<any>) => void>

    private static __owner2container = new Map<hUnit, BuffContainer>()
    private static __linked_events: BuffContainer.Event[] = [
        'START',
        'LOOP',
        'CANCEL', 
        'FINISH'
    ]
}

export namespace BuffContainer {
    export type Event = Buff.Event
    export const actions = new EventActions<BuffContainer.Event,
                                            [BuffContainer, Buff<any>]>
                                            (BuffContainer.name)
}