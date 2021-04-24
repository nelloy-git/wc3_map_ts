import { Action, ActionList, EventActions } from "../Utils";
import { hUnit } from "../Handle";

import { Abil, TargetType } from './Abil'
import { TAbil } from './TAbil'

export class Container {
    constructor(owner: hUnit){
        this.owner = owner
        this.actions = new EventActions(<Container>this, this.toString())

        if (Container.__owner2container.get(owner)){
            error(Container.name + ': ability container for ' + owner.toString() + ' already exists.', 2)
        }
        Container.__owner2container.set(owner, this)
    }

    static get(owner: hUnit | undefined){
        if (!owner){
            return undefined
        }
        return Container.__owner2container.get(owner)
    }

    toString(){
        return this.constructor.name + '<' + this.owner.toString() + '>'
    }

    get list(): ReadonlyMap<number, Abil<TargetType[]>>{
        return this.__list
    }

    set(i: number, type: TAbil<any> | undefined){
        let prev = this.__list.get(i)
        if (prev && prev.type != type){
            prev.destroy() 
        }

        if (type){
            this.__list.set(i, new Abil<any>(this.owner, type))
            this.actions.run('CHANGED', i)  
        } else if (prev) {
            this.__list.delete(i)
            this.actions.run('CHANGED', i)   
        }
    }

    get(i: number): Readonly<Abil<TargetType[]>> | undefined{
        return this.__list.get(i)
    }

    readonly owner: hUnit;
    readonly actions: EventActions<Container.Event, Container, [pos: number]>

    private __list = new Map<number, Abil<TargetType[]>>()

    private static __owner2container = new Map<hUnit, Container>()
}

export namespace Container {
    export type Event = 'CHANGED'
}