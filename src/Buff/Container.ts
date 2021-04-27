import { hUnit } from "../Handle";
import { EventActions} from "../Utils";

import { Buff } from './Buff'
import type { TBuff } from './TBuff'

export class BuffContainer {
    constructor(owner: hUnit){
        if (BuffContainer.__owner2container.get(owner)){
            error(BuffContainer.name + ': buff container already exists.', 2)
        }
        BuffContainer.__owner2container.set(owner, this)

        this.owner = owner
        this.actions = new EventActions(this.toString())
        BuffContainer.actions.link(BuffContainer.__global_event_map, this.actions)

        this.__list = []
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
                break
            }
        }

        if (stacked){
            buff.destroy()
            return
        }

        buff.actions.add('FAIL', () => {this.__removeFromList(buff)})
        buff.actions.add('CANCEL', () => {this.__removeFromList(buff)})
        buff.actions.add('FINISH', () => {this.__removeFromList(buff)})
        this.actions.link(BuffContainer.__buff_event_map,
                          buff.actions,
                          (event, [buff]) => {return [this, buff]})
        buff.actions.add('FAIL', () => {this.__destroyBuff(buff)})
        buff.actions.add('CANCEL', () => {this.__destroyBuff(buff)})
        buff.actions.add('FINISH', () => {this.__destroyBuff(buff)})
                    
        this.__list.push(buff)
        buff.Dur.start(dur)
    }

    get(i: number): Buff<any> | undefined {
        return this.__list[i]
    }

    destroy(){
        for (let i = 0; i < this.__list.length; i++){
            this.__removeFromList(this.__list[i])
            this.__destroyBuff(this.__list[i])
        }
        BuffContainer.__owner2container.delete(this.owner);
    }

    private __removeFromList(buff: Buff<any>){
        let pos = this.__list.indexOf(buff)
        if (pos < 0){
            return false
        }
        this.__list.splice(pos, 1)
        return true
    }

    private __destroyBuff(buff: Buff<any>){
        this.actions.unlink(buff.actions)
        buff.destroy()
    }

    readonly owner: hUnit
    readonly actions: EventActions<BuffContainer.Event, [BuffContainer, Buff<any>]>

    private __list: Buff<any>[]

    private static __owner2container = new Map<hUnit, BuffContainer>()

    private static readonly __global_event_map: ReadonlyMap<BuffContainer.Event, BuffContainer.Event> = new Map([
        ['START', 'START'],
        ['FAIL', 'FAIL'],
        ['LOOP', 'LOOP'],
        ['CANCEL', 'CANCEL'],
        ['FINISH', 'FINISH'],
    ])

    private static readonly __buff_event_map: ReadonlyMap<Buff.Event, BuffContainer.Event> = new Map([
        ['START', 'START'],
        ['FAIL', 'FAIL'],
        ['LOOP', 'LOOP'],
        ['CANCEL', 'CANCEL'],
        ['FINISH', 'FINISH'],
    ])
}

export namespace BuffContainer {
    export type Event = Buff.Event
    export const actions = new EventActions<BuffContainer.Event,
                                            [BuffContainer, Buff<any>]>
                                            (BuffContainer.name)
}