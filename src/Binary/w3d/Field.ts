import { Field, FieldBool, FieldInt, FieldReal, FieldString, FieldUnreal } from "../Field"
import { float2byte, int2byte, str2byte } from "../Utils"

export interface DoodadField<T extends Field.ValueType> extends Field<T> {}

export class DoodadFieldBool extends FieldBool implements DoodadField<boolean> {
    serialize(val: boolean){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte('bool') + int2byte(val ? 1 : 0) + '\0\0\0\0'
    }
}

export class DoodadFieldInt extends FieldInt implements DoodadField<number> {
    serialize(val: number){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte('int') + int2byte(val) + '\0\0\0\0'
    }
}

export class DoodadFieldReal extends FieldReal implements DoodadField<number> {
    serialize(val: number){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte('real') + float2byte(val) + '\0\0\0\0'
    }
}

export class DoodadFieldUnreal extends FieldUnreal implements DoodadField<number> {
    serialize(val: number){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte('unreal') + float2byte(val) + '\0\0\0\0'
    }
}

export class DoodadFieldString extends FieldString implements DoodadField<string> {
    serialize(val: string){
        return this.id + '\0\0\0\0' + '\0\0\0\0' +
                Field.type2byte('string') + str2byte(val) + '\0\0\0\0'
    }
}

export namespace DoodadField {
    export let ShowInFog = new DoodadFieldBool('dshf')
    export let EditorUseList = new DoodadFieldBool('dusr')

    export let ColorRed = new DoodadFieldInt('dvr1')
    export let ColorGreen = new DoodadFieldInt('dvg1')
    export let ColorBlue = new DoodadFieldInt('dvb1')
    export let Variations = new DoodadFieldInt('dvar')

    export let MinScale = new DoodadFieldReal('dmas')
    export let MaxScale = new DoodadFieldReal('dmis')

    export let Model = new DoodadFieldString('dfil')
    export let Name = new DoodadFieldString('dnam')
    export let PathingTexture = new DoodadFieldString('dptx')
}

let all_fields = Object.values(DoodadField)
export function findDoodadField(code: string){
    for (let field of all_fields){
        if (code == field.id){
            return field
        }
    }
    return undefined
}