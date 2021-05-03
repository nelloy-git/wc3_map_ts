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
        this.actions.link(BuffContainer.__global_event_map, BuffContainer.actions)

        this.__list = []
        this.__convert = (event, [buff]) => {return [this, buff, this.__list.indexOf(buff)]}
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

    add<T>(dur: number, type: TBuff<T>, user_data: T){
        let buff = new Buff<T>(this.owner, type, user_data)
        for (let i = 0; i < this.__list.length; i++){
            let destroy = type.TDuration.interaction(buff, this.__list[i])
            if (destroy){
                buff.destroy()
                return
            }
        }

        buff.actions.link(BuffContainer.__buff_event_map, this.actions, this.__convert)
        this.__list.push(buff)

        let started = buff.start(dur)
        if (!started){
            buff.destroy()
            return
        }

        buff.actions.add('DESTROY', () => {
            let pos = this.__list.indexOf(buff)
            if (pos >= 0){
                this.__list.splice(pos, 1)
            }
            this.actions.run('REMOVED', this, buff, pos)
        })
    }

    find(buff: Buff<any>){
        return this.__list.indexOf(buff)
    }

    get(i: number): Buff<any> | undefined {
        return this.__list[i]
    }

    destroy(){
        for (let i = 0; i < this.__list.length; i++){
            this.__list[i].destroy()
        }
        BuffContainer.__owner2container.delete(this.owner);
    }

    readonly owner: hUnit
    readonly actions: EventActions<BuffContainer.Event, [BuffContainer, Buff<any>, number]>

    private __list: Buff<any>[]
    private __convert: (this: void, e: Buff.Event, args: [Buff<any>]) => [BuffContainer, Buff<any>, number]

    private static __owner2container = new Map<hUnit, BuffContainer>()

    private static readonly __global_event_map: ReadonlyMap<BuffContainer.Event, BuffContainer.Event> = new Map([
        ['START', 'START'],
        ['FAIL', 'FAIL'],
        ['LOOP', 'LOOP'],
        ['CANCEL', 'CANCEL'],
        ['FINISH', 'FINISH'],
        ['REMOVED', 'REMOVED'],
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
    export type Event = 'START' | 'FAIL' | 'LOOP' | 'CANCEL' | 'FINISH' | 'REMOVED'
    export const actions = new EventActions<BuffContainer.Event,
                                            [BuffContainer, Buff<any>, number]>
                                            (BuffContainer.name)
}