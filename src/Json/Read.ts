import { getFilePath, Log } from "../Utils";

let __path__ = Macro(getFilePath())

export type Json = LuaTable<JsonKey, JsonVal>
export type JsonVal = boolean | number | string | Json | undefined
export type JsonKey = number | string
export type JsonTree = ReadonlyArray<JsonKey>

function read(json: Json, tree: JsonTree){
    let cur = json
    let wrn = tree.length + 1
    for (let i = 0; i < tree.length; i++){
        let next = cur.get(tree[i])
        if (!next){
            wrn = path ? i : wrn
            break
        }
        cur = next
    }

    if (of_type == 'any'){
        return <T>val
    }

    if (typeof val !== of_type){
        val = def
        wrn = Math.min(wrn, tree.length)
    }

    if (!path){
        return val ? <T>val : def
    }

    if (wrn){
        Log.wrn('Can not find ' + of_type + ' "' + key + '" in ' + path)
    }

    return <T>val
}