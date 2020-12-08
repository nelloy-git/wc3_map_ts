import { Data } from "./Type/Data";
import { Process } from "./Type/Process";

export class Type<T> {
    constructor(data: Data, process: Process<T>){
        this.data = data
        this.process = process
    }

    readonly data: Data
    readonly process: Process<T>
}