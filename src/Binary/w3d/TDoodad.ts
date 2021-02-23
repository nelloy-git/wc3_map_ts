import { int2byte } from "../Utils";
import { Log } from "../../Utils";

import { Field } from '../Field'
import { findTDoodadField, TDoodadField, TDoodadFieldBool, TDoodadFieldInt, TDoodadFieldReal, TDoodadFieldString, TDoodadFieldUnreal } from './Field'

export type TDoodad = {
    readonly id: string
    readonly origin_id: string
    readonly fields: {
        readonly [key: string]: Field.ValueType
    }
}

let ignore: TDoodadField<any>[] = [
    TDoodadField.Name,
    TDoodadField.MinScale,
    TDoodadField.MaxScale,
    TDoodadField.EditorUserList,
]

export namespace TDoodad {
    export function create(id: string, origin_id: string): TDoodad{
        return {
            id: id,
            origin_id: origin_id,
            fields: {}
        }
    }

    export function createFromJson(json: LuaHash){
        let id = json['id']
        if (typeof id !== 'string'){
            return Log.err('can not get id')
        }

        let origin_id = json['origin_id']
        if (typeof origin_id !== 'string'){
            return Log.err('can not get origin_id')
        }

        let dood = TDoodad.create(id, origin_id)

        let jfields = json['fields']
        if (typeof jfields !== 'object'){
            return Log.err('can not get fields')
        }

        for (let code in jfields){
            let field = <TDoodadField<any> | undefined>findTDoodadField(code)
            if (!field){
                Log.wrn('TDoodad: unknown field ' + code)
                continue
            }

            let val = (<LuaHash>jfields)[code]
            let is_valid = ((typeof val === 'boolean' && field.type == 'bool') ||
                            (typeof val === 'number' && (field.type == 'int' || field.type == 'real' || field.type == 'unreal')) ||
                            (typeof val === 'string' && field.type == 'string'))
            if (!is_valid){
                return Log.err('value type is not valid')    
            }

            (<{[k: string]: Field.ValueType}>dood.fields)[code] = <Field.ValueType>val
        }

        return dood
    }

    export function setField(dood: TDoodad, field: TDoodadFieldBool, val: boolean | undefined): void
    export function setField(dood: TDoodad, field: TDoodadFieldInt, val: number | undefined): void
    export function setField(dood: TDoodad, field: TDoodadFieldReal, val: number | undefined): void
    export function setField(dood: TDoodad, field: TDoodadFieldString, val: string | undefined): void
    export function setField(dood: TDoodad, field: TDoodadFieldUnreal, val: number | undefined): void
    export function setField(dood: TDoodad, field: TDoodadFieldBool | TDoodadFieldInt | TDoodadFieldReal | TDoodadFieldUnreal | TDoodadFieldString, val: boolean | number | string | undefined): void
    export function setField<T extends Field.ValueType>(dood: TDoodad, field: TDoodadField<T>, val: T){
        // if (ignore.includes(field)){return}
        let field_id = field.id;
        (<{[k: string]: T}>dood.fields)[field_id] = val
    }
    
    export function getField(dood: TDoodad, field: TDoodadFieldBool): boolean | undefined
    export function getField(dood: TDoodad, field: TDoodadFieldInt): number | undefined
    export function getField(dood: TDoodad, field: TDoodadFieldReal): number | undefined
    export function getField(dood: TDoodad, field: TDoodadFieldString): string | undefined
    export function getField(dood: TDoodad, field: TDoodadFieldUnreal): number | undefined
    export function getField<T extends Field.ValueType>(dood: TDoodad, field: TDoodadField<T>): T | undefined {
        return <T | undefined>dood.fields[field.id]
    }

    export function serialize(dood: TDoodad){
        let head = dood.origin_id + dood.id

        let s_fields: string = ''
        let count = 0
        for (let code in dood.fields){
            count++

            let field = <TDoodadField<any> | undefined>findTDoodadField(code)
            if (!field){
                Log.wrn('TDoodad: unknown field ' + code)
                continue
            }

            s_fields += field.toBinary(dood.fields[code])
        }

        return head + int2byte(count) + s_fields
    }
}