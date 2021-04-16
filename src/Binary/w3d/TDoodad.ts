import * as Utils from '../../Utils'

import { Obj } from "../Obj"
import { Field } from '../Field'
import { TDoodadFieldChange } from './Field'
import { int2byte } from '../Utils'

export class TDoodad extends Obj {

    static fromBinary(file: Utils.FileBinary){
        let tdood = new TDoodad()
        tdood.origin_id = file.readChar(4)
        tdood.id = file.readChar(4)
        if ((tdood.id.charCodeAt(0) + tdood.id.charCodeAt(1) + 
            tdood.id.charCodeAt(2) + tdood.id.charCodeAt(3)) == 0){
            tdood.id = tdood.origin_id
        }

        let changes_count = file.readInt(4)
        for (let i = 0; i < changes_count; i++){
            tdood.changes.push(TDoodadFieldChange.fromBinary(file))
        }

        return tdood
    }

    toBinary(){
        let raw = ''
        raw += this.origin_id
        raw += this.id

        raw += int2byte(this.changes.length)
        for (const change of this.changes){
            raw += change.toBinary()
        }

        return raw
    }

    findChange(field: Field<Field.ValueType>){
        for (let change of this.changes){
            if (change.field == field){
                return change
            }
        }
    }

    get id(){ return this.__id }
    set id(id: string){
        this.__id = id.slice(0, 4)
    }

    get origin_id(){ return this.__origin_id }
    set origin_id(origin_id: string){
        this.__origin_id = origin_id.slice(0, 4)
    }
    
    public changes: TDoodadFieldChange<Field.ValueType>[] = []

    private __id: string = ''
    private __origin_id: string = ''
}