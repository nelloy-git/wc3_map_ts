import type { TData } from './TData'
import type { TDuration } from './TDuration'

export class TBuff<T> {
    constructor(TData: TData<T>, TDuration: TDuration<T>){
        this.TData = TData
        this.TDuration = TDuration
    }

    readonly TData: TData<T>
    readonly TDuration: TDuration<T>
}