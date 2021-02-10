import { getFilePath, Json, Log } from "../../../Utils";
import { AbilityParams, ReadonlyAbilityParams, readParams } from "./Params"

let __path__ = Macro(getFilePath())

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
    }
    dmg.base = base

    let baseMult = json['baseMult']
    if (typeof baseMult !== 'object'){
        baseMult = {}
    }
    dmg.baseMult = readParams(baseMult)

    let baseAdd = json['baseAdd']
    if (typeof baseAdd !== 'object'){
        baseAdd = {}
    }
    dmg.baseAdd = readParams(baseAdd)

    let resultMult = json['resultMult']
    if (typeof resultMult !== 'object'){
        resultMult = {}
    }
    dmg.resultMult = readParams(resultMult)

    return <ReadonlyAbilityScale>dmg
}