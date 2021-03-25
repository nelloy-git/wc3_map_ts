import { getFilePath, Log } from "../Utils";

let __path__ = Macro(getFilePath())

type Type = boolean | number | string | object
type SType = 'any' | 'boolean' | 'number' | 'string' | 'object'

function isArray(t: any){
    if (typeof t !== "object"){
        return false
    } 

    // check if all the table keys are numerical and count their number
    let count = 0
    for (let k in t){
        if (typeof(k) !== "number"){
            return false
        }
        count++
    }

    // all keys are numerical. now let's see if they are sequential and start with 1
    for (let i = 0; i < count; i++){
        //Hint: the VALUE might be "nil", in that case "not t[i]" isn't enough, that's why we check the type
        if (!t[i] && typeof t[i] !== "undefined"){
            return false
        }
    }
    return true
}

function read<T extends Type>(json: LuaTable, key: string | number, of_type: SType, def?: T, path?: string){
    let val = (<LuaHash>json)[key]
    if (of_type == 'any'){
        return <T>val
    }

    let wrn = false
    if (typeof val !== of_type){
        val = <any>def
        if (def != undefined && path != undefined){
            wrn = true
        }
    }

    if (!path){
        return val ? <T>val : def
    }

    if (wrn){
        Log.wrn('Can not find ' + of_type + ' "' + key + '" in ' + path)
    }

    return <T>val
}

function readArray<T extends Type>(json: LuaTable, key: string | number, of_type: SType, def?: T, path?: string){
    let arr = read<LuaTable>(json, key, 'object', {}, path)

    if (!arr || !isArray(arr)){
        if (path){
            Log.wrn('Can not find Array<' + of_type + '> with key "' + key + '" in ' + path)
        }
        return def
    } 

    for (let i = 0; i < (<Array<any>>arr).length; i++){
        if (typeof (<Array<any>>arr)[i] !== of_type){
            if (path){
                Log.wrn('Array<' + of_type + '>[' + i + '] with key "' + key + '" is not ' + of_type + ' in ' + path)
            }
            return def
        }
    }
    return arr
}

export namespace Read {

    export function Any(json: LuaTable, key: string | number): any | undefined {
        return read(json, key, 'any')
    }

    export function Bool(json: LuaTable, key: string | number): boolean | undefined
    export function Bool(json: LuaTable, key: string | number, def: boolean): boolean
    export function Bool(json: LuaTable, key: string | number, def: boolean, wrn_path: string): boolean
    export function Bool(json: LuaTable, key: string | number, def?: boolean, wrn_path?: string){
        return read(json, key, 'boolean', def, wrn_path)
    }
    
    export function Number(json: LuaTable, key: string | number): number | undefined
    export function Number(json: LuaTable, key: string | number, def: number): number
    export function Number(json: LuaTable, key: string | number, def: number, wrn_path: string): number
    export function Number(json: LuaTable, key: string | number, def?: number, wrn_path?: string){
        return read(json, key, 'number', def, wrn_path)
    }
    
    export function String(json: LuaTable, key: string | number): string | undefined
    export function String(json: LuaTable, key: string | number, def: string): string
    export function String(json: LuaTable, key: string | number, def: string, wrn_path: string): string
    export function String(json: LuaTable, key: string | number, def?: string, wrn_path?: string){
        return read(json, key, 'string', def, wrn_path)
    }
    
    export function Table(json: LuaTable, key: string | number): LuaTable | undefined
    export function Table(json: LuaTable, key: string | number, def: LuaTable): LuaTable
    export function Table(json: LuaTable, key: string | number, def: LuaTable, wrn_path: string): LuaTable
    export function Table(json: LuaTable, key: string | number, def?: LuaTable, wrn_path?: string){
        return read(json, key, 'object', def, wrn_path)
    }
    
    export function BooleanArray(json: LuaTable, key: string | number): boolean[] | undefined
    export function BooleanArray(json: LuaTable, key: string | number, def: boolean[]): boolean[]
    export function BooleanArray(json: LuaTable, key: string | number, def: boolean[], wrn_path: string): boolean[]
    export function BooleanArray(json: LuaTable, key: string | number, def?: boolean[], wrn_path?: string){
        return readArray(json, key, 'boolean', def, wrn_path)
    }
    
    export function NumberArray(json: LuaTable, key: string | number): number[] | undefined
    export function NumberArray(json: LuaTable, key: string | number, def: number[]): number[]
    export function NumberArray(json: LuaTable, key: string | number, def: number[], wrn_path: string): number[]
    export function NumberArray(json: LuaTable, key: string | number, def?: number[], wrn_path?: string){
        return readArray(json, key, 'number', def, wrn_path)
    }
    
    export function StringArray(json: LuaTable, key: string | number): string[] | undefined
    export function StringArray(json: LuaTable, key: string | number, def: string[]): string[]
    export function StringArray(json: LuaTable, key: string | number, def: string[], wrn_path: string): string[]
    export function StringArray(json: LuaTable, key: string | number, def?: string[], wrn_path?: string){
        return readArray(json, key, 'string', def, wrn_path)
    }
    
    export function TableArray(json: LuaTable, key: string | number): LuaTable[] | undefined
    export function TableArray(json: LuaTable, key: string | number, def: LuaTable[]): LuaTable[]
    export function TableArray(json: LuaTable, key: string | number, def: LuaTable[], wrn_path: string): LuaTable[]
    export function TableArray(json: LuaTable, key: string | number, def?: LuaTable[], wrn_path?: string){
        return readArray(json, key, 'object', def, wrn_path)
    }
}

