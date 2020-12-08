import { hUnit } from "../Handle";
import { Buff } from './Buff'
import { Type } from "./Type";

export class Container {
    constructor(owner: hUnit){
        this._owner = owner
        Container._owner2container.set(owner, this)
    }
    static get(owner: hUnit){
        return Container._owner2container.get(owner)
    }

    get owner(){return this._owner}
    get length(){return this._list.length}
    get list(){
        let copy: Buff<any>[] = []
        for (let buff of this._list){copy.push(buff)}
        return copy
    }

    add<T>(src: hUnit, dur: number, type: Type<T>, data: T){
        let buff = new Buff<T>(src, this._owner, type, data)
        buff.addAction('CANCEL', ()=>{this.remove(buff)})
        buff.addAction('FINISH', ()=>{this.remove(buff)})
        this._list.push(buff)
        
        buff.start(dur)
    }

    get(i: number){
        return this._list[i]
    }

    private remove(buff: Buff<any>){
        let pos = this._list.indexOf(buff)
        if (pos < 0){return false}
        this._list.splice(pos, 1)
        return true
    }

    private _owner: hUnit
    private _list: Buff<any>[] = []

    private static _owner2container = new Map<hUnit, Container>()
}