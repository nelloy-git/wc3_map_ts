import * as Param from "../../../Parameter";
import { getFilePath, Json } from "../../../Utils";

let __path__ = getFilePath()

export type AbilityParams = {
    [param in Param.Type]: number
}

export type ReadonlyAbilityParams = {
    readonly [param in Param.Type]: number
}

export function readParams(json: Json.JsonData){
    let res = <AbilityParams>{};

    let params_list = Param.Type.list()
    for (let param of params_list){
        let val = json[param]
        if (typeof val !== 'number'){
            val = 0
        }
        res[param] = val
    }

    return <ReadonlyAbilityParams>res
}