export interface JsonFileIface {
    read(): LuaTable | undefined
    write(data: LuaTable): void
}