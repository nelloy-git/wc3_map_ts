import { hUnit } from "../Handle";
import { EventActions } from "../Utils";

import { Buff } from './Buff'
import type { TBuff } from './TBuff'

export class Container {
    constructor(owner: hUnit){
        this.owner = owner
        this.actions = new EventActions(<Container>this, this.toString())
        this.__list = []

        if (Container.__owner2container.get(owner)){
            throw (Container.name + ': buff container already exists.')
        }
        Container.__owner2container.set(owner, this)
    }

    static get(owner: hUnit | undefined){
        if (!owner){
            return undefined
        }
        return Container.__owner2container.get(owner)
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
            this.__list.push(buff)
            buff.Dur.actions.add('CANCEL', () => {this.__remove(buff)})
            buff.Dur.actions.add('FINISH', () => {this.__remove(buff)})
            buff.Dur.start(dur)
            this.actions.run('CHANGED')
        }
    }

    remove(i: number){
        if (this.__list[i]){
            this.__list.splice(i, 1)
            this.actions.run('CHANGED')
        }
    }

    get(i: number): Readonly<Buff<any>> | undefined{
        return this.__list[i]
    }

    find(t: TBuff<any>){
        let list = []
        for (const buff of this.__list){
            if (buff && buff.type == t){
                list.push(buff)
            }
        }
        return list
    }

    private __remove(buff: Buff<any>){
        let pos = this.__list.indexOf(buff)
        if (pos < 0){
            return false
        }
        
        this.remove(pos)
    }

    readonly owner: hUnit
    readonly actions: EventActions<Container.Event, Container>

    private __list: Buff<any>[]

    private static __owner2container = new Map<hUnit, Container>()
}

export namespace Container {
    export type Event = 'CHANGED'
}