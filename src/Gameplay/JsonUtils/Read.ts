import { getFilePath, Log, Json } from "../../Utils";

let __path__ = Macro(getFilePath())

export function readNumber(json: LuaTable, field: string, json_path?: string){
    let val = json[field]
    if (typeof val !== 'number'){
        return Log.err('can not get field \'' + field + '\' from ' + json_path,
                       __path__, undefined, 3)
    }
    return val
}

export function readString(json: LuaTable, field: string, json_path?: string){
    let val = json[field]
    if (typeof val !== 'string'){
        return Log.err('can not get field \'' + field + '\' from ' + json_path,
                       __path__, undefined, 3)
    }
    return val
}

export function readTable(json: LuaTable, field: string, json_path?: string){
    let val = json[field]
    if (typeof val !== 'object'){
        return Log.err('can not get field \'' + field + '\' from ' + json_path,
                       __path__, undefined, 3)
    }
    return <LuaTable>val
}