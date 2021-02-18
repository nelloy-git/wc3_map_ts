import { id2byte, int2byte } from "../Utils";
import { id2int, Log } from "../../Utils";

import { findDoodadField, DoodadField, DoodadFieldBool, DoodadFieldInt, DoodadFieldReal, DoodadFieldString, DoodadFieldUnreal } from './Field'
import { Field } from '../Field'

export type TDoodad = {
    readonly id: string
    readonly origin_id: string
    readonly fields: {
        [key: string]: Field.ValueType
    }
}

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
            let field = <DoodadField<any> | undefined>findDoodadField(code)
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

            dood.fields[code] = <Field.ValueType>val
        }

        return dood
    }

    export function setField(dood: TDoodad, field: DoodadFieldBool, val: boolean | undefined): void
    export function setField(dood: TDoodad, field: DoodadFieldInt, val: number | undefined): void
    export function setField(dood: TDoodad, field: DoodadFieldReal, val: number | undefined): void
    export function setField(dood: TDoodad, field: DoodadFieldString, val: string | undefined): void
    export function setField(dood: TDoodad, field: DoodadFieldUnreal, val: number | undefined): void
    export function setField(dood: TDoodad, field: DoodadFieldBool | DoodadFieldInt | DoodadFieldReal | DoodadFieldUnreal | DoodadFieldString, val: boolean | number | string | undefined): void
    export function setField<T extends Field.ValueType>(dood: TDoodad, field: DoodadField<T>, val: T){
        let field_id = field.id;
        (<{[k: string]: T}>dood.fields)[field_id] = val
    }
    
    export function getField(dood: TDoodad, field: DoodadFieldBool): boolean | undefined
    export function getField(dood: TDoodad, field: DoodadFieldInt): number | undefined
    export function getField(dood: TDoodad, field: DoodadFieldReal): number | undefined
    export function getField(dood: TDoodad, field: DoodadFieldString): string | undefined
    export function getField(dood: TDoodad, field: DoodadFieldUnreal): number | undefined
    export function getField<T extends Field.ValueType>(dood: TDoodad, field: DoodadField<T>): T | undefined {
        return <T | undefined>dood.fields[field.id]
    }

    export function serialize(dood: TDoodad){
        let head = dood.origin_id + dood.id

        let s_fields: string = ''
        let count = 0
        for (let code in dood.fields){
            count++

            let field = <DoodadField<any> | undefined>findDoodadField(code)
            if (!field){
                Log.wrn('TDoodad: unknown field ' + code)
                continue
            }

            s_fields += field.toBinary(dood.fields[code])
        }

        return head + int2byte(count) + s_fields
    }
}