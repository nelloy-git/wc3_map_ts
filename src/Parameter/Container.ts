import { Type, List } from "./Type";
import { Value, ValueType } from "./Value";

interface ContainerValues extends Record<Type, Value> {}

export abstract class Container {

    constructor(){
        let vals = <ContainerValues>{}
        for (const p of List){
            vals[p] = new Value(0, 1, 0)
        }

        this.__values = vals
    }

    get(param: Type, type: ValueType){
        return this.__values[param][type]
    }

    set(val: number, param: Type, type: Exclude<ValueType, 'RES'>){
        this.__values[param][type] = val
    }

    add(val: number, param: Type, type: Exclude<ValueType, 'RES'>){
        this.__values[param][type] += val
    }

    protected __values: ContainerValues
}