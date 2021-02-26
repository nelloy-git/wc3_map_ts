import { FileBinary, Log } from "../Utils";
import { byte2float, byte2int, byte2str, float2byte, int2byte, str2byte } from "./Utils";

export abstract class Field<T extends Field.ValueType> {
    protected constructor(id: string, type: Field.WcType){
        this.id = id
        this.type = type
    }

    abstract toBinary(val: T): string
    abstract fromBinary(file: FileBinary): T

    abstract toJson(val: T): LuaTable
    abstract fromJson(Json: LuaTable): T

    readonly id;
    readonly type;
}

export abstract class FieldBool extends Field<boolean> {
    constructor(id: string){
        super(id, 'bool')
    }
}

export abstract class FieldInt extends Field<number> {
    constructor(id: string){
        super(id, 'int')
    }
}

export abstract class FieldReal extends Field<number> {
    constructor(id: string){
        super(id, 'real')
    }
}

export abstract class FieldUnreal extends Field<number> {
    constructor(id: string){
        super(id, 'unreal')
    }
}

export abstract class FieldString extends Field<string> {
    constructor(id: string){
        super(id, 'string')
    }
}

export namespace Field {
    export type ValueType = boolean|number|string
    export type WcType = 'bool'|'int'|'real'|'unreal'|'string'

    export function type2byte(type: Field.WcType){
        let code
        if (type == 'bool' || type == 'int') {code = 0}
        else if (type == 'real') {code = 1}
        else if (type == 'unreal') {code = 2}
        else {code = 3}
        return int2byte(code)
    }

    export function val2byte(t: WcType, val: ValueType){
        if (t == 'bool' && typeof val === "boolean"){
            return int2byte(<boolean>val ? 1 : 0)
        } else if (t == 'int' && typeof val === 'number'){
            return int2byte(<number>val)
        } else if ((t == 'real' || t == 'unreal') && typeof val === 'number'){
            return float2byte(<number>val)
        } else if (t == 'string' && typeof val === 'string'){
            return str2byte(<string>val)
        } else {
            return Log.err('unknown value type.')
        }
    }

    export function byte2val(t: WcType, b: string){
        if (t == 'bool'){
            return byte2int(b) == 1 ? true : false
        } else if (t == 'int'){
            return byte2int(b)
        } else if (t == 'real' || t == 'unreal'){
            return byte2float(b)
        } else if (t == 'string'){
            return byte2str(b)
        } else {
            return Log.err('unknown value type.')
        }
    }
}