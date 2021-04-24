import type { TData } from './Data/Type'
import type { TDuration } from './Duration/Type'

export class TBuff<T> {
    constructor(TData: TData<T>, TDuration: TDuration<T>){
        this.TData = TData
        this.TDuration = TDuration
    }

    readonly TData: TData<T>
    readonly TDuration: TDuration<T>
}