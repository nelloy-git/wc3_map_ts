import { hUnit } from "../../src/Handle";
import { Action, ActionList, Log } from "../../src/Utils";
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
        return this.__list
    }

    add<T>(src: hUnit, dur: number, type: TBuff<T>, user_data: T){
        let buff = new Buff<T>(src, this.owner, type, user_data)
        
        if (type.TData.stackable()){
            let main = this.find(type)
            if (main){
                main.Dur.addStack(buff)
                return
            }
        }

        buff.Dur.addAction('CANCEL', () => {this.__remove(buff)})
        buff.Dur.addAction('FINISH', () => {this.__remove(buff)})
        this.__list.push(buff)
        
        buff.Dur.start(dur)
        this.__actions.get('LIST_CHANGED')?.run(this, 'LIST_CHANGED')
    }

    remove(i: number){
        this.__list.splice(i, 1)
        this.__actions.get('LIST_CHANGED')?.run(this, 'LIST_CHANGED')
    }

    get(i: number): Readonly<Buff<any>> | undefined{
        return this.__list[i]
    }

    find(t: TBuff<any>){
        for (const buff of this.__list){
            if (buff && buff.type == t){
                return buff
            }
        }
        return undefined
    }

    addAction(event: Container.Event,
              callback: (this: void, cont: Container, event: Container.Event) => void){
        return this.__actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[Container, Container.Event], void> | undefined){
        for (let [event, list] of this.__actions){
            if (list.remove(action)){return true}
        }
        return false
    }

    private __remove(buff: Buff<any>){
        let pos = this.__list.indexOf(buff)
        if (pos < 0){return false}
        
        this.__list.splice(pos, 1)
        this.__actions.get('LIST_CHANGED')?.run(this, 'LIST_CHANGED')
        return true
    }

    readonly owner: hUnit

    private __list: (Buff<any> | undefined)[] = []
    private __actions = new Map<Container.Event, ActionList<[Container, Container.Event]>>([
        ['LIST_CHANGED', new ActionList()],
    ])

    private static _owner2container = new Map<hUnit, Container>()
}

export namespace Container {
    export type Event = 'LIST_CHANGED'
}