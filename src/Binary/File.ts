import { FileBinary } from "../Utils";
import { Obj } from "./Obj";

export abstract class File<T extends Obj> extends Obj {
    static fromBinary: (file: FileBinary)=>File<Obj>
    abstract toBinary(): string

    objects: T[] = []
}