export type Json = LuaTable<JsonKey, JsonVal>
export type JsonVal = boolean | number | string | Json | undefined
export type JsonKey = number | string
export type JsonTree = ReadonlyArray<JsonKey>

export function decode(this: void, str: string) : Json 
export function encode(this: void, json: Json) : string