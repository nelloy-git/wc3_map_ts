import { IFace } from './IFace'
import { Ability } from './Ability'
import { hUnit } from "../Handle";
import { Action, ActionList, Log } from "../Utils";
import { Type } from './Type';

export class Container {
    constructor(owner: hUnit){
        this.owner = owner
        if (Container._owner2container.get(owner)){
            return Log.err(Container.name + 
                           ': already exists.', 2)
        }
        Container._owner2container.set(owner, this)
    }
    static get(owner: hUnit | undefined){
        if (!owner){return undefined}
        return Container._owner2container.get(owner)
    }

    readonly owner: hUnit;

    set(i: number, type: Type<any> | undefined){
        let abil = type ? new Ability(this.owner, type) : undefined
        this._list[i] = abil
        this._actions.run(this)
    }

    get(i: number){
        return this._list[i]
    }
    
    getList(size: number){
        let copy: (IFace | undefined)[] = []
        for (let i = 0; i < size; i++){
            copy[i] = this._list[i]
        }
        return copy
    }

    addAction(callback: (this: void, cont: Container)=>void){
        return this._actions.add(callback)
    }

    removeAction(action: Action<[Container], void> | undefined){
        return this._actions.remove(action) 
    }

    private _list: (IFace | undefined)[] = []
    private _actions: ActionList<[Container]> = new ActionList<[Container]>()

    private static _owner2container = new Map<hUnit, Container>()
}