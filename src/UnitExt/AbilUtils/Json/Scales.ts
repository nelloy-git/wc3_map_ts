import { getFilePath, Json, Log } from "../../../Utils";
import { AbilityParams, ReadonlyAbilityParams, readParams } from "./Params"

let __path__ = getFilePath()

export type AbilityScale = {
    base: number
    baseMult: AbilityParams
    baseAdd: AbilityParams
    resultMult: AbilityParams
}

export type ReadonlyAbilityScale = {
    readonly base: number
    readonly baseMult: ReadonlyAbilityParams
    readonly baseAdd: ReadonlyAbilityParams
    readonly resultMult: ReadonlyAbilityParams
}

export function readScales(json: Json.JsonData, json_path?: string){
    let dmg = <AbilityScale> {}

    let base = json['base']
    if (typeof base !== 'number'){
        base = 0
        // return Log.err('can not get field \'base\'' +
        //                (json_path ? ' from ' + json_path : ''), __path__, undefined, 2)
    }
    dmg.base = base

    let baseMult = json['baseMult']
    if (typeof baseMult !== 'object'){
        baseMult = {}
        // return Log.err('can not get field \'baseMult\'' +
        //                (json_path ? ' from ' + json_path : ''), __path__, undefined, 2)
    }
    dmg.baseMult = readParams(baseMult)

    let baseAdd = json['baseAdd']
    if (typeof baseAdd !== 'object'){
        baseAdd = {}
        // return Log.err('can not get field \'baseAdd\'' +
        //                (json_path ? ' from ' + json_path : ''), __path__, undefined, 2)
    }
    dmg.baseAdd = readParams(baseAdd)

    let resultMult = json['resultMult']
    if (typeof resultMult !== 'object'){
        resultMult = {}
        // return Log.err('can not get field \'resultMult\'' +
        //                (json_path ? ' from ' + json_path : ''), __path__, undefined, 2)
    }
    dmg.resultMult = readParams(resultMult)

    return <ReadonlyAbilityScale>dmg
}