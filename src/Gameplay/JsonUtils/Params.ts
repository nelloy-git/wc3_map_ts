import * as Param from "../../Parameter";
import { readNumber } from "./Read";

export type ParamsJsonData = {
    [param in Param.Type]: number
}

export type ReadonlyJsonParams = {
    readonly [param in Param.Type]: number
}

export function readJsonParams(json: LuaHash | undefined, path?: string){
    let res = <ParamsJsonData>{}

    let params_list = Param.Type.list()
    for (let param of params_list){
        res[param] = 0
        if (!json){
            continue
        }

        if (typeof json[param] !== 'undefined'){
            res[param] = readNumber(json, param, path)
        }
    }

    return <ReadonlyJsonParams>res
}