import { TypeData } from "./Type/Data";
import { TypeProcess } from "./Type/Process";

export class Type<T> {
    constructor(data: TypeData, process: TypeProcess<T>){
        this.data = data
        this.process = process
    }

    readonly data: TypeData
    readonly process: TypeProcess<T>
}