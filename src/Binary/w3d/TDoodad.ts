import { id2byte, int2byte } from "../Utils";
import { Log } from "../../Utils";

import { findDoodadField, DoodadField, DoodadFieldBool, DoodadFieldInt, DoodadFieldReal, DoodadFieldString, DoodadFieldUnreal } from './Field'
import { Field } from '../Field'

export type TDoodad = {
    readonly id: number
    readonly origin_id: number
    readonly fields: {
        [key: string]: Field.ValueType
    }
}

export namespace TDoodad {
    export function create(id: number, origin_id: number): TDoodad{
        return {
            id: id,
            origin_id: origin_id,
            fields: {}
        }
    }

    export function setField(dood: TDoodad, field: DoodadFieldBool, val: boolean | undefined): void
    export function setField(dood: TDoodad, field: DoodadFieldInt, val: number | undefined): void
    export function setField(dood: TDoodad, field: DoodadFieldReal, val: number | undefined): void
    export function setField(dood: TDoodad, field: DoodadFieldString, val: string | undefined): void
    export function setField(dood: TDoodad, field: DoodadFieldUnreal, val: number | undefined): void
    export function setField<T extends Field.ValueType>(dood: TDoodad, field: DoodadField<T>, val: T){
        let field_id = field.id;
        (<{[k: string]: T}>dood.fields)[field_id] = val
    }
    
    export function getField(dood: TDoodad, field: DoodadFieldBool): boolean | undefined
    export function getField(dood: TDoodad, field: DoodadFieldInt): number | undefined
    export function getField(dood: TDoodad, field: DoodadFieldReal): number | undefined
    export function getField(dood: TDoodad, field: DoodadFieldString): string | undefined
    export function getField(dood: TDoodad, field: DoodadFieldUnreal): number | undefined
    export function getField<T extends Field.ValueType>(dood: TDoodad, field: DoodadField<T>): T | undefined{
        return <T | undefined>dood.fields[field.id]
    }

    export function serialize(dood: TDoodad){
        let head = id2byte(dood.origin_id) + 
                  id2byte(dood.id)

        let s_fields: string = ''
        let count = 0
        for (let code in dood.fields){
            count++

            let field = <DoodadField<any> | undefined>findDoodadField(code)
            if (!field){
                Log.wrn('TDoodad: unknown field ' + code)
                continue
            }

            s_fields += field.serialize(dood.fields[code])
        }

        return head + int2byte(count) + s_fields
    }
}