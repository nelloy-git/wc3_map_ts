import { hUnit } from "../Handle";
import { Action, ActionList } from "../Utils";
import { Buff } from './Buff'
import { Type } from "./Type";

export class Container {
    constructor(owner: hUnit){
        this.owner = owner
        Container._owner2container.set(owner, this)
    }
    static get(owner: hUnit){
        return Container._owner2container.get(owner)
    }

    readonly owner: hUnit
    get size(){return this._list.length}
    get list(){
        let copy: Buff<any>[] = []
        for (let buff of this._list){copy.push(buff)}
        return copy
    }

    add<T>(src: hUnit, dur: number, type: Type<T>, data: T){
        let buff = new Buff<T>(src, this.owner, type, data)
        buff.addAction('CANCEL', ()=>{this._remove(buff)})
        buff.addAction('FINISH', ()=>{this._remove(buff)})
        this._list.push(buff)
        
        buff.start(dur)
        this._actions.run(this)
    }

    get(i: number){
        return this._list[i]
    }

    addAction(callback: (this: void, cont: Container)=>void){
        return this._actions.add(callback)
    }

    removeAction(action: Action<[Container], void>){
        return this._actions.remove(action) 
    }

    private _remove(buff: Buff<any>){
        let pos = this._list.indexOf(buff)
        if (pos < 0){return false}
        
        this._list.splice(pos, 1)
        this._actions.run(this)
        return true
    }

    private _list: Buff<any>[] = []
    private _actions: ActionList<[Container]> = new ActionList<[Container]>()

    private static _owner2container = new Map<hUnit, Container>()
}