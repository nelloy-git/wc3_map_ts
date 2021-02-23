import { Field, FieldBool, FieldInt, FieldReal, FieldString, FieldUnreal } from "../Field"
import { float2byte, int2byte, str2byte } from "../Utils"

export interface TDoodadField<T extends Field.ValueType> extends Field<T> {}

export class TDoodadFieldBool extends FieldBool implements TDoodadField<boolean> {
    toBinary(val: boolean){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte('bool') + int2byte(val ? 1 : 0) + '\0\0\0\0'
    }
}

export class TDoodadFieldInt extends FieldInt implements TDoodadField<number> {
    toBinary(val: number){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte('int') + int2byte(val) + '\0\0\0\0'
    }
}

export class TDoodadFieldReal extends FieldReal implements TDoodadField<number> {
    toBinary(val: number){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte('real') + float2byte(val) + '\0\0\0\0'
    }
}

export class TDoodadFieldUnreal extends FieldUnreal implements TDoodadField<number> {
    toBinary(val: number){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte('unreal') + float2byte(val) + '\0\0\0\0'
    }
}

export class TDoodadFieldString extends FieldString implements TDoodadField<string> {
    toBinary(val: string){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte('string') + str2byte(val) + '\0\0\0\0'
    }
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