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
            this.__linkActions(buff)
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
            this.__unlinkActions(buff)
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

    private __runActions(event: BuffContainer.Event, buff: Buff<any>){
        BuffContainer.actions.run(event, this, buff)
        this.actions.run(event, this, buff)
    }

    private __removeByEvent(event: 'CANCEL' | 'FINISH', buff: Buff<any>){
        let pos = this.__list.indexOf(buff)
        this.__list.splice(pos, 1)
        this.__runActions(event, buff)
        this.__unlinkActions(buff)
        buff.destroy()
    }

    private __linkActions(buff: Buff<any>){
        if (this.__list_actions.get(buff)){
            log(this.toString() + ': previous linked action list is not empty.', 'Wrn')
        }

        let list: Action<[Buff.Event, Buff<any>]>[] = []
        this.__list_actions.set(buff, list)

        for (const event of BuffContainer.__linked_events){
            let act
            if (event == 'CANCEL' || event == 'FINISH'){
                act = buff.actions.add(event, () => {this.__removeByEvent(event, buff)})
            } else {
                act = buff.actions.add(event, () => {this.__runActions(event, buff)})
            }
            list.push(act)
        }
    }

    private __unlinkActions(buff: Buff<any>){
        const list = this.__list_actions.get(buff)
        this.__list_actions.delete(buff)
        if (!list){
            log(this.toString() + ': linked action list is empty.', 'Wrn')
            return
        }

        for (const act of list){
            let removed = buff.actions.remove(act)
            if (!removed){
                log(this.toString() + ': can not remove linked action', 'Wrn')
            }
        }
    }

    readonly owner: hUnit
    readonly actions: EventActions<BuffContainer.Event, [BuffContainer, Buff<any>]>

    private __list: Buff<any>[]
    private __list_actions: Map<Buff<any>, Action<[Buff.Event, Buff<any>]>[]>

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