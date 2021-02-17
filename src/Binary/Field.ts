import { int2byte } from "./Utils";

export abstract class Field<T extends Field.ValueType> {
    constructor(id: string, type: Field.WcType){
        this.id = id
        this.type = type
    }

    abstract serialize(val: T): string

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
}