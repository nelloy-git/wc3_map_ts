import * as Json from '../../Json'
import * as Param from "../../Parameter";

import { ParamsJson } from "./Params"

const BASE = ['base']
const BASE_MULT = ['baseMult']
const BASE_ADD = ['baseAdd']
const RES_MULT = ['resMult']
const RES_ADD = ['resAdd']

export class ScaleJson {
    constructor(json: Json.Data){
        this.base = json.getNumber(BASE)

        let silent = json.silent

        json.silent = true
        if (json.isExist(BASE_MULT)){
            this.baseMult = new ParamsJson(json.getSub(BASE_MULT), 1)
        }
        if (json.isExist(BASE_ADD)){
            this.baseAdd = new ParamsJson(json.getSub(BASE_ADD), 0)
        }
        if (json.isExist(RES_MULT)){
            this.resMult = new ParamsJson(json.getSub(RES_MULT), 1)
        }
        if (json.isExist(RES_ADD)){
            this.resAdd = new ParamsJson(json.getSub(RES_ADD), 0)
        }
        json.silent = silent
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