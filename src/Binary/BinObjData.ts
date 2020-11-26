import { Log } from "../Utils";
import { bytes, float2byte, int2byte, str2byte } from "./Utils";

export type ValueType = 'bool'|'int'|'real'|'unreal'|'string'

export class BinObjField {
    constructor(id: string, type: 'bool')
    constructor(id: string, type: 'int')
    constructor(id: string, type: 'real')
    constructor(id: string, type: 'unreal')
    constructor(id: string, type: 'string')
    constructor(id: string, type: ValueType){

        this.id = id
        this.type = type
    }

    public newData(value: boolean|number|string){
        if (this.type == 'bool'){
            if (typeof value === 'boolean'){
                return new BinObjData(this.type, value)
            }
        } else if (this.type == 'int'){
            if (typeof value === 'number'){
                return new BinObjData(this.type, value)
            }
        } else if (this.type == 'real'){
            if (typeof value === 'number'){
                return new BinObjData(this.type, value)
            }
        } else if (this.type == 'unreal'){
            if (typeof value === 'number'){
                return new BinObjData(this.type, value)
            }
        } else if (this.type == 'string'){
            if (typeof value === 'string'){
                return new BinObjData(this.type, value)
            }
        }

        return Log.err(BinObjField.name + 
                       ': wrong value type.')
    }

    readonly id;
    readonly type;
}

export class BinObjData {
    constructor(type: 'bool', val: boolean)
    constructor(type: 'int', val: number)
    constructor(type: 'real', val: number)
    constructor(type: 'unreal', val: number)
    constructor(type: 'string', val: string)
    constructor(type: ValueType, val: boolean|number|string){

        this.type = type
        this.value = (type == 'int' && typeof val === 'number') ? Math.floor(val) : val
    }

    public typeBytes(): bytes{
        switch (this.type){
            case 'bool': {return int2byte(0)}
            case 'int': {return int2byte(0)}
            case 'real': {return int2byte(1)}
            case 'unreal': {return int2byte(2)}
            case 'string': {return int2byte(3)}
        }
    }

    public bytes(): bytes{
        if (this.type == 'bool' || this.type == 'int'){
            return int2byte(this.value as number)
        } else if (this.type == 'real' || this.type == 'unreal'){
            return float2byte(this.value as number)
        } else {
            return str2byte(this.value as string)
        }
    }

    readonly type;
    readonly value;
}