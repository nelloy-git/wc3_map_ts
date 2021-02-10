import * as Param from "../../Parameter";
import { getFilePath, Json, Log } from "../../Utils";

let __path__ = getFilePath()

export type UnitExtParams = {
    [param in Param.Type]: [number, number, number]
}

export type ReadonlyUnitExtParams = {
    readonly [param in Param.Type]: [number, number, number]
}

function err(json_path?: string){
    return Log.err('wrong \"Params\" format in json file. ' + (json_path ? json_path : ''),
                    __path__, undefined, 2)
}

export function readUnitExtParams(json: Json.JsonData, json_path?: string){
    let res = <UnitExtParams>{};

    let params_list = Param.Type.list()
    for (let param of params_list){
        let val_list = json[param]
        if (typeof val_list !== 'object'){return err(json_path)}

        let base = val_list[0]
        if (typeof base !== 'number'){return err(json_path)}

        let mult = val_list[1]
        if (typeof mult !== 'number'){return err(json_path)}

        let add = val_list[2]
        if (typeof add !== 'number'){return err(json_path)}

        res[param] = [base, mult, add]
    }

    return <ReadonlyUnitExtParams>res
}