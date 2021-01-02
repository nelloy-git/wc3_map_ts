import { Log } from '../../Utils'
import { Change } from '../Change'
import { Field } from '../Field'
import { FieldDecor, FieldDecorList } from './Field'

export class DecorChange<T extends Field.ValueType> extends Change<T> {
    constructor(field: FieldDecor<T>, val: T){
        // Check is field available
        let found = false
        let available_fields = Object.values(FieldDecorList)
        for (let i = 0; i < available_fields.length; i++){
            if (available_fields[i].id == field.id){
                found = true
                break
            }
        }
        if (!found){
            Log.err(DecorChange.name + 
                    ': field \'' + field.id + '\' is not available for decor.')
        }

        super(field, val)
    }
}