import { getFilePath, Log } from "../Utils";

let __path__ = Macro(getFilePath())

export namespace Read {
    export function Bool(json: LuaTable, key: string | number, path?: string){
        let val = (<LuaHash>json)[key]
        if (typeof val !== 'boolean'){
            return Log.err('can not get key \'' + key + (path ?  '\' from ' + path : ''),
                           __path__, undefined, 2)
        }
        return val
    }

    export function Number(json: LuaTable, key: string | number, path?: string){
        let val = (<LuaHash>json)[key]
        if (typeof val !== 'number'){
            return Log.err('can not get key \'' + key + (path ?  '\' from ' + path : ''),
                           __path__, undefined, 2)
        }
        return val
    }
    
    export function String(json: LuaTable, key: string | number, path?: string){
        let val = (<LuaHash>json)[key]
        if (typeof val !== 'string'){
            return Log.err('can not get key \'' + key + (path ?  '\' from ' + path : ''),
                           __path__, undefined, 2)
        }
        return val
    }
    
    export function Table(json: LuaTable, key: string | number, path?: string){
        let val = (<LuaHash>json)[key]
        if (typeof val !== 'object'){
            print(type(val))
            return Log.err('can not get key \'' + key + (path ?  '\' from ' + path : ''),
                           __path__, undefined, 2)
        }
        return <LuaTable>val
    }
    
    export function BooleanArray(json: LuaTable, key: string | number, path?: string){
        let arr = Table(json, key, path)
        let arr_k: string | number
        for (arr_k in arr){
            if (typeof arr_k !== 'boolean'){
                return Log.err('BooleanArray can not contain string keys. ' + (path ? path : ''),
                               __path__, undefined, 2)
            }
    
            Number(arr, arr_k, path)
        }
        return <number[]><unknown>arr
    }
    
    export function NumberArray(json: LuaTable, key: string | number, path?: string){
        let arr = Table(json, key, path)
        let arr_k: string | number
        for (arr_k in arr){
            if (typeof arr_k !== 'number'){
                return Log.err('StringArray can not contain string keys. ' + (path ? path : ''),
                               __path__, undefined, 2)
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
                return Log.err('StringArray can not contain string keys. ' + (path ? path : ''),
                               __path__, undefined, 2)
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
                return Log.err('StringArray can not contain string keys. ' + (path ? path : ''),
                               __path__, undefined, 2)
            }
    
            Table(arr, arr_k, path)
        }
        return <LuaTable[]><unknown>arr
    }
}

