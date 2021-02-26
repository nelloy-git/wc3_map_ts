import { getFilePath, Log } from "../Utils";

let __path__ = Macro(getFilePath())

export function readJson(str: string) {
    return Json.decode(str)
}

export namespace Read {
    export function Number(json: LuaTable, key: string | number, path?: string){
        let val = (<LuaHash>json)[key]
        if (typeof val !== 'number'){
            return Log.err('can not get key \'' + key + '\' from ' + path,
                           __path__, undefined, 3)
        }
        return val
    }
    
    export function String(json: LuaTable, key: string | number, path?: string){
        let val = (<LuaHash>json)[key]
        if (typeof val !== 'string'){
            return Log.err('can not get key \'' + key + '\' from ' + path,
                           __path__, undefined, 3)
        }
        return val
    }
    
    export function Table(json: LuaTable, key: string | number, path?: string){
        let val = (<LuaHash>json)[key]
        if (typeof val !== 'object'){
            print(type(val))
            return Log.err('can not get key \'' + key + '\' from ' + path,
                           __path__, undefined, 3)
        }
        return <LuaTable>val
    }
    
    export function NumberArray(json: LuaTable, key: string | number, path?: string){
        let arr = Table(json, key, path)
        let arr_k: string | number
        for (arr_k in arr){
            if (typeof arr_k !== 'number'){
                return Log.err('StringArray can not contain string keys. ' + path,
                               __path__, undefined, 3)
            }
    
            Number(arr, arr_k, path)
        }
        return <number[]><unknown>arr
    }
    
    export function StringArray(json: LuaTable, key: string | number, path?: string){
        let arr = Table(json, key, path)
        let arr_k: string | number
        for (arr_k in arr){
            if (typeof arr_k !== 'number'){
                return Log.err('StringArray can not contain string keys. ' + path,
                               __path__, undefined, 3)
            }
    
            String(arr, arr_k, path)
        }
        return <string[]><unknown>arr
    }
    
    export function TableArray(json: LuaTable, key: string | number, path?: string){
        let arr = Table(json, key, path)
        let arr_k: string | number
        for (arr_k in arr){
            if (typeof arr_k !== 'number'){
                return Log.err('StringArray can not contain string keys. ' + path,
                               __path__, undefined, 3)
            }
    
            Table(arr, arr_k, path)
        }
        return <LuaTable[]><unknown>arr
    }
}

