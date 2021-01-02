import { Log } from '../../Utils'
import { Change } from '../Change'
import { Field } from '../Field'
import { FieldUnit, FieldUnitList } from './Field'

export class UnitChange<T extends Field.ValueType> extends Change<T> {
    constructor(field: FieldUnit<T>, val: T){
        // Check is field available
        let found = false
        let available_fields = Object.values(FieldUnitList)
        for (let i = 0; i < available_fields.length; i++){
            if (available_fields[i].id == field.id){
                found = true
                break
            }
        }
        if (!found){
            Log.err(UnitChange.name + 
                    ': field \'' + field.id + '\' is not available for unit.')
        }

        super(field, val)
    }
}