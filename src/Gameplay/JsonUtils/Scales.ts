import * as Json from '../../Json'
import * as Param from "../../Parameter";

import { ParamsJson } from "./Params"

const BASE = ['base']
const BASE_ADD = ['baseAdd']
const BASE_MULT = ['baseMult']
const RES_MULT = ['resMult']
const RES_ADD = ['resAdd']

export class ScaleJson {
    constructor(json: Json.Data){
        this.base = 0
        if (json.isExist(BASE)){
            this.base = json.getNumber(BASE)
        }
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
    }

    /** (BASE + BASE_ADD * BASE_MULT) * RES_MULT + RES_ADD */
    getResult(params: Param.Container){
        let res = this.base

        if (this.baseAdd){
            let add = this.baseAdd.getResult(params)
            if (this.baseMult){
                add *= 1 + this.baseMult.getResult(params)
            }
            res += add
        }

        if (this.resMult){
            res *= 1 + this.resMult.getResult(params)
        }

        if (this.resAdd){
            res += this.resAdd.getResult(params)
        }

        return res
    }

    /** (BASE + BASE_ADD * BASE_MULT) * RES_MULT + RES_ADD */
    getFormula(prec_base: number = 0, prec_add: number = 0, prec_mult: number = 0){

        let [done_base, f_base] = this.base != 0 ? [true, string.format('%.' + prec_base + 'f', this.base)] : [false, '']
        let [done_base_add, f_base_add] = this.baseAdd ? this.baseAdd.getFormula(prec_add) : [false, '']
        let [done_base_mult, f_base_mult] = this.baseMult ? this.baseMult.getFormula(prec_mult) : [false, '']
        let [done_res_mult, f_res_mult] = this.resMult ? this.resMult.getFormula(prec_mult) : [false, '']
        let [done_res_add, f_res_add] = this.resAdd ? this.resAdd.getFormula(prec_add) : [false, '']

        let f = f_base
        if (done_base_add){
            let f_base_add_mult
            if (done_base_mult){
                f_base_add_mult = '(' + f_base_add + ') * (1 + ' + f_base_mult + ')'
            } else {
                f_base_add_mult = f_base_add
            }
            
            f += ' + ' + f_base_add_mult
        }

        if (done_res_mult){
            if (f.charAt(0) != '('){
                f = '(' + f + ')'
            }
            f += ' * (1 + ' + f_res_mult + ')'
        }

        if (done_res_add){
            f += ' + ' + f_res_add
        }

        return '[' + f + ']'
    }
    
    readonly base: number
    readonly baseMult: ParamsJson | undefined
    readonly baseAdd: ParamsJson | undefined
    readonly resMult: ParamsJson | undefined
    readonly resAdd: ParamsJson | undefined
}