import { FileBinary, Log } from "../Utils";
import { Obj } from "./Obj";
import { byte2float, byte2int, byte2str, float2byte, int2byte, str2byte } from "./Utils";

export abstract class Field<T extends Field.ValueType> {
    protected constructor(
        public readonly id: string,
        public readonly type: Field.WcType){
    }
}

export class FieldBool extends Field<boolean> {
    constructor(id: string){ super(id, 'bool') }
}

export class FieldInt extends Field<number> {
    constructor(id: string){ super(id, 'int') }
}

export class FieldReal extends Field<number> {
    constructor(id: string){ super(id, 'real') }
}

export class FieldUnreal extends Field<number> {
    constructor(id: string){ super(id, 'unreal') }
}

export class FieldString extends Field<string> {
    constructor(id: string){ super(id, 'string') }
}

export abstract class FieldChange<T extends Field.ValueType> extends Obj {
    constructor(
        public field: Field<T>,
        public val: T){
        super()
    }

    static fromBinary: (file: FileBinary)=> FieldChange<Field.ValueType>
    static fromJson: (json: LuaTable, path: string)=> FieldChange<Field.ValueType>

    abstract toBinary(): string
    abstract toJson(): LuaTable
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

    export function byte2val(t: WcType, file: FileBinary){
        if (t == 'bool'){
            return file.readInt(4) == 1 ? true : false
        } else if (t == 'int'){
            return file.readInt(4)
        } else if (t == 'real' || t == 'unreal'){
            return file.readFloat()
        } else if (t == 'string'){
            return file.readString()
        } else {
            return Log.err('unknown value type.')
        }
    }
}