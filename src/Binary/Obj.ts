import { FileBinary } from "../Utils";

export abstract class Obj {
    static fromBinary: (file: FileBinary)=>Obj
    abstract toBinary(): string
}