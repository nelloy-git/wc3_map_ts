import { FileBinary } from "../Utils";

export abstract class Obj {
    abstract toBinary(): string
    abstract fromBinary(file: FileBinary): void

    abstract toJson(): LuaTable
    abstract fromJson(json: LuaTable): void
}