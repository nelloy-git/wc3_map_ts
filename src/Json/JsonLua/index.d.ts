export type Data = LuaTable<Key, Val>
export type Key = number | string
export type Val = boolean | number | string | Data | undefined
export type Tree = ReadonlyArray<Key>

export function decode(this: void, str: string) : Data
export function encode(this: void, json: Data) : string