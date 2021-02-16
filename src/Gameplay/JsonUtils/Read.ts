import { getFilePath, Log, Json } from "../../Utils";

let __path__ = Macro(getFilePath())

export function readNumber(json: LuaTable, key: string, path?: string){
    let val = json[key]
    if (typeof val !== 'number'){
        return Log.err('can not get key \'' + key + '\' from ' + path,
                       __path__, undefined, 3)
    }
    return val
}

export function readString(json: LuaTable, key: string, path?: string){
    let val = json[key]
    if (typeof val !== 'string'){
        return Log.err('can not get key \'' + key + '\' from ' + path,
                       __path__, undefined, 3)
    }
    return val
}

export function readTable(json: LuaTable, key: string, path?: string){
    let val = json[key]
    if (typeof val !== 'object'){
        return Log.err('can not get key \'' + key + '\' from ' + path,
                       __path__, undefined, 3)
    }
    return <LuaTable>val
}

export function readStringArray(json: LuaTable, key: string, path?: string){
    let arr = readTable(json, key, path)
    let arr_k: string | number
    for (arr_k in arr){
        if (typeof arr_k !== 'number'){
            return Log.err('StringArray can not contain string keys. ' + path,
                           __path__, undefined, 3)
        }

        readString(arr, arr_k, path)
    }
    return <string[]><unknown>arr
}