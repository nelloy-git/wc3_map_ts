import { int2byte } from "../Utils";
import { Log } from "../../Utils";

import { Field } from '../Field'
import { findTUnitField, TUnitField, TUnitFieldBool, TUnitFieldInt, TUnitFieldReal, TUnitFieldString, TUnitFieldUnreal } from './Field'

export type TUnit = {
    readonly id: string
    readonly origin_id: string
    readonly fields: {
        [key: string]: Field.ValueType
    }
}

export namespace TUnit {
    export function create(id: string, origin_id: string): TUnit{
        return {
            id: id,
            origin_id: origin_id,
            fields: {}
        }
    }

    export function setField(dood: TUnit, field: TUnitFieldBool, val: boolean | undefined): void
    export function setField(dood: TUnit, field: TUnitFieldInt, val: number | undefined): void
    export function setField(dood: TUnit, field: TUnitFieldReal, val: number | undefined): void
    export function setField(dood: TUnit, field: TUnitFieldString, val: string | undefined): void
    export function setField(dood: TUnit, field: TUnitFieldUnreal, val: number | undefined): void
    export function setField(dood: TUnit, field: TUnitFieldBool | TUnitFieldInt | TUnitFieldReal | TUnitFieldUnreal | TUnitFieldString, val: Field.ValueType): void
    export function setField<T extends Field.ValueType>(dood: TUnit, field: TUnitField<T>, val: T){
        let field_id = field.id;
        (<{[k: string]: T}>dood.fields)[field_id] = val
    }
    
    export function getField(dood: TUnit, field: TUnitFieldBool): boolean | undefined
    export function getField(dood: TUnit, field: TUnitFieldInt): number | undefined
    export function getField(dood: TUnit, field: TUnitFieldReal): number | undefined
    export function getField(dood: TUnit, field: TUnitFieldString): string | undefined
    export function getField(dood: TUnit, field: TUnitFieldUnreal): number | undefined
    export function getField<T extends Field.ValueType>(dood: TUnit, field: TUnitField<T>): T | undefined {
        return <T | undefined>dood.fields[field.id]
    }

    export function serialize(unit: TUnit){
        let head = unit.origin_id + unit.id

        let s_fields: string = ''
        let count = 0
        for (let code in unit.fields){
            count++

            let field = <TUnitField<any> | undefined>findTUnitField(code)
            if (!field){
                Log.wrn('TUnit: unknown field ' + code)
                continue
            }

            s_fields += field.toBinary(unit.fields[code])
        }

        return head + int2byte(count) + s_fields
    }

}