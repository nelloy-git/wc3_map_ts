import { FileBinary, getFilePath } from "../Utils";
import { Obj } from "./Obj";

let __path__ = Macro(getFilePath)

export abstract class File<T extends Obj> extends Obj {
    static fromBinary: (file: FileBinary)=>File<Obj>
    static fromJson: (json: LuaTable, path: string)=>File<Obj>

    abstract toBinary(): string
    abstract toJson(): LuaTable

    objects: T[] = []
}