import { hUnit } from "../Handle";
import { Unit } from "../Handle/Unit";
import { Buff } from './Buff'
import { Type } from "./Type";

export class Container {
    constructor(owner: hUnit){
        this._owner = owner
    }

    get owner(){return this._owner}
    get length(){return this._list.length}
    get list(){
        let copy: Buff<any>[] = []
        for (let buff of this._list){copy.push(buff)}
        return copy
    }

    add<T>(src: Unit, dur: number, type: Type<T>, data: T){
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
        buff.destroy()
        return true
    }

    private _owner: Unit
    
    private _list: Buff<any>[] = []
}