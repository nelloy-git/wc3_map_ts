import { Field } from "./Field";
import { float2byte, int2byte, str2byte } from "./Utils";

export abstract class Change<T extends Field.ValueType> {
    constructor(field: Field<T>, val: T){
        this.field = field
        this.value = val
    }

    serialize(){
        // let res = this.field.serialize()

        // let val = this.value
        // if (typeof val === 'number'){
        //     if (this.field.type == 'int'){
        //         res += int2byte(val)    
        //     } else {
        //         res += float2byte(val)
        //     }
        // } else if (typeof val === 'string'){
        //     res += str2byte(val)
        // } else {
        //     // Bool
        //     res += int2byte(val ? 1 : 0)
        // }

        return '' // res + '\0\0\0\0'
    }

    readonly field: Field<T>
    value: T
}