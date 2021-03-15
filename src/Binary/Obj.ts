import { FileBinary } from "../Utils";

export abstract class Obj {
    static fromBinary: (file: FileBinary)=>Obj
    static fromJson: (json: LuaTable, path: string)=>Obj

    abstract toBinary(): string
    abstract toJson(): LuaTable
}