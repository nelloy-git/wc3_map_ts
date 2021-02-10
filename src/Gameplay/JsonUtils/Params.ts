import * as Param from "../../Parameter";
import { getFilePath, Json, Log } from "../../Utils";

let __path__ = Macro(getFilePath())

export type JsonParams = {
    [param in Param.Type]: number
}

export type ReadonlyJsonParams = {
    readonly [param in Param.Type]: number
}

export function readJsonParams(json: LuaTable, path?: string){
    let res = <JsonParams>{};

    let params_list = Param.Type.list()
    for (let param of params_list){
        let val = json[param]
        if (typeof val !== 'number'){
            return Log.err('parameters have wrong format. ' + (path ? path : ''),
                            __path__, undefined, 2)
        }
        res[param] = val
    }

    return <ReadonlyJsonParams>res
}