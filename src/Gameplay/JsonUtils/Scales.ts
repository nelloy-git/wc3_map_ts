import * as Json from '../../Json'
import * as Param from "../../Parameter";

import { ParamsJson } from "./Params"

export class ScaleJson {
    constructor(json: LuaTable){
        let base = Json.Read.Number(json, 'base') 
        base = base ? base : 0

        let bmult = Json.Read.Table(json, 'baseMult')
        let badd = Json.Read.Table(json, 'baseAdd')
        let rmult = Json.Read.Table(json, 'resMult')
        let radd = Json.Read.Table(json, 'resAdd')

        this.base = base
        this.baseMult = bmult ? new ParamsJson(bmult) : undefined
        this.baseAdd = badd ? new ParamsJson(badd) : undefined
        this.resMult = rmult ? new ParamsJson(rmult) : undefined
        this.resAdd = radd ? new ParamsJson(radd) : undefined
    }

    getResult(params: Param.Container){
        let res = this.base

        if (this.baseMult){
            res *= this.baseMult.getResult(params)
        }

        if (this.baseAdd){
            res += this.baseAdd.getResult(params)
        }

        if (this.resMult){
            res *= this.resMult.getResult(params)
        }

        if (this.resAdd){
            res += this.resAdd.getResult(params)
        }

        return res
    }
    
    readonly base: number
    readonly baseMult: ParamsJson | undefined
    readonly baseAdd: ParamsJson | undefined
    readonly resMult: ParamsJson | undefined
    readonly resAdd: ParamsJson | undefined
}