import { Field } from "../Field";
import { FieldDecor } from './Field'
import { id2byte, int2byte } from "../Utils";
import { DecorChange } from "./Change";
import { Object } from "../Object";

export class Decor extends Object {
    constructor(base_id: number, id: number, changes: DecorChange<any>[]){
        super(base_id, id, changes)
    }

    serialize(){
        let raw = id2byte(this.base_id) + 
                  id2byte(this.id) + 
                  int2byte(this._changes.length)
        this._changes.forEach(change => {
            raw += change.serialize()
        })
        return raw
    }
    
    get changes(): ReadonlyArray<DecorChange<any>>{
        return this._changes
    }

    protected _get<T extends Field.ValueType>(field: FieldDecor<T>): T|undefined{
        for (let i = 0; i < this._changes.length; i++){
            if (field.id == this._changes[i].field.id){
                return this._changes[i].value
            }
        }
    }
    
    protected _set<T extends Field.ValueType>(field: FieldDecor<T>,
                                              val: T){
        let change
        for (let i = 0; i < this._changes.length; i++){
            if (field.id == this._changes[i].field.id){
                change = this._changes[i]
                break
            }
        }

        if (change){
            change.value = val
        } else {
            let change = new DecorChange<T>(field, val)
            this._changes.push(change)
        }
    }
}