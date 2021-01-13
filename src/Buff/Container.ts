import { hUnit } from "../Handle";
import { Action, ActionList, Log } from "../Utils";
import { Buff, TBuff } from './Buff'
import { IFace } from './Buff/IFace'

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
    
    get list(): ReadonlyArray<Buff<any> | undefined>{
        return this._list
    }

    add<T>(src: hUnit, dur: number, type: TBuff<T>, user_data: T){
        let buff = new Buff<T>(src, this.owner, type, user_data)
        buff.Dur.addAction('CANCEL', () => {this._remove(buff)})
        buff.Dur.addAction('FINISH', () => {this._remove(buff)})
        this._list.push(buff)
        
        buff.Dur.start(dur)
        this._actions.get('LIST_CHANGED')?.run(this, 'LIST_CHANGED')
    }

    del(i: number){
        this._list.splice(i, 1)
        this._actions.get('LIST_CHANGED')?.run(this, 'LIST_CHANGED')
    }

    get(i: number): Readonly<Buff<any>> | undefined{
        return this._list[i]
    }

    addAction(event: Container.Event,
              callback: (this: void, cont: Container, event: Container.Event) => void){
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[Container, Container.Event], void> | undefined){
        for (let [event, list] of this._actions){
            if (list.remove(action)){return true}
        }
        return false
    }

    private _remove(buff: Buff<any>){
        let pos = this._list.indexOf(buff)
        if (pos < 0){return false}
        
        this._list.splice(pos, 1)
        this._actions.get('LIST_CHANGED')?.run(this, 'LIST_CHANGED')
        return true
    }

    readonly owner: hUnit

    private _list: (Buff<any> | undefined)[] = []
    private _actions = new Map<Container.Event, ActionList<[Container, Container.Event]>>([
        ['LIST_CHANGED', new ActionList()],
    ])

    private static _owner2container = new Map<hUnit, Container>()
}

export namespace Container {
    export type Event = 'LIST_CHANGED'
}