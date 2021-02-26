import { FileBinary } from "../../Utils"
import { Field, FieldBool, FieldInt, FieldReal, FieldString, FieldUnreal } from "../Field"
import { float2byte, int2byte, str2byte } from "../Utils"

export abstract class TDoodadField<T extends Field.ValueType> extends Field<T> {
    toBinary(val: T){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte(this.type) + Field.val2byte(this.type, val) + '\0\0\0\0'
    }

    fromBinary(file: FileBinary){
        let code = file.readChar(4)
        let type = file.readInt(4)
        let variation = file.readInt(4)
        let pointer = file.readInt(4)
        let val = Field.byte2val(this.type, file.re)
    }
}

export class TDoodadFieldBool extends TDoodadField<boolean> {
    constructor(id: string){super(id, 'bool')}
}

export class TDoodadFieldInt extends TDoodadField<number> {
    constructor(id: string){super(id, 'int')}
}

export class TDoodadFieldReal extends TDoodadField<number> {
    constructor(id: string){super(id, 'real')}
}

export class TDoodadFieldUnreal extends TDoodadField<number> {
    constructor(id: string){super(id, 'unreal')}
}

export class TDoodadFieldString extends TDoodadField<string> {
    constructor(id: string){super(id, 'string')}
}

export namespace TDoodadField {
    export let ShowInFog = new TDoodadFieldBool('dshf')
    export let EditorUserList = new TDoodadFieldBool('dusr')

    export let ColorRed = new TDoodadFieldInt('dvr1')
    export let ColorGreen = new TDoodadFieldInt('dvg1')
    export let ColorBlue = new TDoodadFieldInt('dvb1')
    export let Variations = new TDoodadFieldInt('dvar')

    export let MinScale = new TDoodadFieldUnreal('dmas')
    export let MaxScale = new TDoodadFieldUnreal('dmis')
    
    export let MaxRoll = new TDoodadFieldUnreal('dmar')
    export let MaxPitch = new TDoodadFieldUnreal('dmap')

    export let Model = new TDoodadFieldString('dfil')
    export let Name = new TDoodadFieldString('dnam')
    export let PathingTexture = new TDoodadFieldString('dptx')
}

let all_fields = Object.values(TDoodadField)
export function findTDoodadField(code: string){
    for (let field of all_fields){
        if (code == field.id){
            return field
        }
    }
    return undefined
}