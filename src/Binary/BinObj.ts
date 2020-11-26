import { Log } from "../Utils";
import { BinObjData, BinObjField } from "./BinObjData";
import { bytes, int2byte } from "./Utils";


export class BinObj {
    constructor(id: number, base: number){
        this.id = id
        this.base = base
    }

    public serialize(){
        let res: bytes = ''

        let count = 0
        for (let [field, data] of this._values){
            res += field.id + data.typeBytes() + data.bytes() + BinObj._block_end
            count++
        }
        res = int2byte(this.id) + int2byte(this.base) +
              int2byte(count) + res

        return res
    }

    protected _getValue<T extends boolean|number|string|undefined>(field: BinObjField){
        return this._values.get(field)?.value as T
    }

    protected _setValue(field: BinObjField, value?: boolean|number|string){
        if (typeof value === 'undefined'){
            this._values.delete(field)
            return
        }
        this._values.set(field, field.newData(value))
    }

    readonly id: number;
    readonly base: number;
    protected _values = new Map<BinObjField, BinObjData>()

    protected static _block_end = '\0\0\0\0'
}