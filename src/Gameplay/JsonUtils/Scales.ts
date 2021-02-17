import { ParamsJsonData, ReadonlyJsonParams, readJsonParams } from "./Params"
import { readNumber, readTable } from "./Read";

export type ScaleJsonData = {
    base: number
    baseMult: ParamsJsonData
    baseAdd: ParamsJsonData
    resultMult: ParamsJsonData
}

export type ReadonlyScaleJsonData = {
    readonly base: number
    readonly baseMult: ReadonlyJsonParams
    readonly baseAdd: ReadonlyJsonParams
    readonly resultMult: ReadonlyJsonParams
}

export function readScale(json: LuaHash, path?: string){
    let scale = <ScaleJsonData>{}

    if (typeof json['base'] === 'undefined'){
        scale.base = 0
    } else {
        scale.base = readNumber(json, 'base', path)
    }
    
    let raw_baseMult = json['baseMult'] ? readTable(json, 'baseMult', path) : undefined
    scale.baseMult = readJsonParams(raw_baseMult)
    
    let raw_baseAdd = json['baseAdd'] ? readTable(json, 'baseAdd', path) : undefined
    scale.baseAdd = readJsonParams(raw_baseAdd)
    
    let raw_resultMult = json['resultMult'] ? readTable(json, 'resultMult', path) : undefined
    scale.resultMult = readJsonParams(raw_resultMult)

    return <ReadonlyScaleJsonData>scale
}