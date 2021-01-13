import { Action, ActionList, Log } from "../Utils";
import { hUnit } from "../Handle";

import { Ability, TAbility } from './Ability'

export class Container {
    constructor(owner: hUnit){
        this.owner = owner
        if (Container._owner2container.get(owner)){
            return Log.err(Container.name + 
                           ': already exists.')
        }
        Container._owner2container.set(owner, this)
    }

    static get(owner: hUnit | undefined){
        if (!owner){return undefined}
        return Container._owner2container.get(owner)
    }

    get list(): ReadonlyMap<number, Ability<any>>{
        return this._list
    }

    set(i: number, type: TAbility<any>){
        this._list.set(i, new Ability(this.owner, type))
        this._actions.get('LIST_CHANGED')?.run(this, 'LIST_CHANGED')
    }

    del(i: number){
        this._list.delete(i)
        this._actions.get('LIST_CHANGED')?.run(this, 'LIST_CHANGED')
    }

    get(i: number): Readonly<Ability<any>> | undefined{
        return this._list.get(i)
    }

    addAction(event: Container.Event,
              callback: (this: void, cont: Container, event: Container.Event)=>void){
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[Container, Container.Event], void> | undefined){
        for (let [event, list] of this._actions){
            if (list.remove(action)){return true}
        }
        return false
    }

    readonly owner: hUnit;

    private _list = new Map<number, Ability<any>>()
    private _actions = new Map<Container.Event, ActionList<[Container, Container.Event]>>([
        ['LIST_CHANGED', new ActionList()],
    ])

    private static _owner2container = new Map<hUnit, Container>()
}

export namespace Container {
    export type Event = 'LIST_CHANGED'
}