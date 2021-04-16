import { FileBinary } from "../Utils";
import { Obj } from "./Obj";

export abstract class ObjList<T extends Obj> extends Obj {
    static fromBinary: (file: FileBinary)=>ObjList<Obj>
    abstract toBinary(): string

    objects: T[] = []
}