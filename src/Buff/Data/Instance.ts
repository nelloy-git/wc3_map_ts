import { hUnit } from "../../Handle";

import type { Buff } from '../Buff'
import type { TData } from './Type'

export class Data<T> {
    constructor(buff: Buff<T>, type: TData<T>, user_data: T){
        this.buff = buff
        this.user_data = user_data
        this.__type = type
    }

    get name(){return this.__type.name(this.buff)}
    get icon(){return this.__type.icon(this.buff)}
    get tooltip(){return this.__type.tooltip(this.buff)}

    stackable(base: Buff<T>){
        return this.__type.stackable(this.buff, base)
    }

    add_duration(base: Buff<T>){
        return this.__type.add_duration(this.buff, base)
    }

    readonly buff: Buff<T>
    user_data: T

    private __type: TData<T>
}