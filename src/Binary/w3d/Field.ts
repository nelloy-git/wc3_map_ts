import * as Json from '../../Json'

import { FileBinary, Log } from "../../Utils"
import { Field, FieldBool, FieldChange, FieldInt, FieldReal, FieldString, FieldUnreal } from "../Field"
import { int2byte } from '../Utils'
import { DoodadsMeta } from './DoodadsMeta'

export class TDoodadFieldChange<T extends Field.ValueType> extends FieldChange<T>{
    constructor(field: Field<T>, val: T, variation: number){
        super(field, val)
        this.variation = variation
    }

    static fromBinary(file: FileBinary){
        let code = file.readChar(4)
        let field = findTDoodadField(code)
        if (!field){
            return Log.err('unknown field ' + code)
        }

        let b_type = file.readChar(4)
        let variation =  file.readInt(4)
        file.readInt(4) // data pointer unused

        if (Field.type2byte(field.type) != b_type){
            return Log.err(code + ' field.type != typeof(value)\n' +
                            'field: ' + Field.type2byte(field.type).charCodeAt(0) + '\n' +
                            'value: ' + b_type.charCodeAt(0))
        }

        let val = Field.byte2val(field.type, file)

        file.readChar(4) // Pass 4 bytes

        return new TDoodadFieldChange<Field.ValueType>(field, val, variation)
    }

    static fromJson(json: LuaTable, path: string){
        let code = Json.Read.String(json, 'id', '\0\0\0\0', path)
        let field = findTDoodadField(code)
        if (!field){
            return Log.err('unknown field')
        }

        let variation = Json.Read.Number(json, 'v', 0, path)

        let val 
        if (field.type == 'bool'){
            val = Json.Read.Bool(json, 'val', false, path)
        } else if (field.type == 'int' || field.type == 'real' || field.type == 'unreal'){
            val = Json.Read.Number(json, 'val', 0, path)
        } else if (field.type == 'string'){
            val = Json.Read.String(json, 'val', 'undefined', path)
        } else {
            return Log.err('unknown field type')
        }

        return new TDoodadFieldChange<Field.ValueType>(field, val, variation)
    }

    toBinary(){
        return this.field.id + '\0\0\0\0' + int2byte(this.variation) +
                Field.type2byte(this.field.type) + Field.val2byte(this.field.type, this.val) + '\0\0\0\0'
    }

    toJson(){
        return {
            id: this.field.id,
            v: this.variation,
            val: this.val,
        }
    }

    variation: number = 0
}

export namespace TDoodadField {
    export let ShowInFog = new FieldBool('dshf')
    export let EditorUserList = new FieldBool('dusr')

    export let ColorRed = new FieldInt('dvr1')
    export let ColorGreen = new FieldInt('dvg1')
    export let ColorBlue = new FieldInt('dvb1')
    export let Variations = new FieldInt('dvar')

    export let DefaultSize = new FieldUnreal('ddes')
    export let MinScale = new FieldUnreal('dmas')
    export let MaxScale = new FieldUnreal('dmis')
    
    export let MaxRoll = new FieldUnreal('dmar')
    export let MaxPitch = new FieldUnreal('dmap')

    export let Model = new FieldString('dfil')
    export let Name = new FieldString('dnam')
    export let PathingTexture = new FieldString('dptx')

    export let Sound = new FieldString('dsnd')
    export let SelSize = new FieldUnreal('dsel')
    export let VisibleRadius = new FieldUnreal('dvis')
    export let Walkable = new FieldBool('dwlk')
    export let Floats = new FieldBool('dflt')
    export let ShownInFog = new FieldBool('dshd')
    export let AnimationInFog = new FieldBool('danf')
    export let FixedRot = new FieldBool('dfxr')
    export let ShownInMM = new FieldBool('dsmm')
    export let UseMMColor = new FieldBool('dumc')
    export let MMRed = new FieldInt('dmmr')
    export let MMGreen = new FieldInt('dmmg')
    export let MMBlue = new FieldInt('dmmb')
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

// Verify fields
if (!IsGame()){
    let meta = DoodadsMeta.getFields()
    for (const id of meta){
        let field = findTDoodadField(id)
        if (!field){
            Log.wrn('id "' + id + '" is not registered')
        }
    }
}