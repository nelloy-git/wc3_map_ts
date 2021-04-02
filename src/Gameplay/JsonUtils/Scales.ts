import * as Json from '../../Json'
import * as Param from "../../Parameter";

import { ParamsJson } from "./Params"

const BASE = ['base']
const BASE_ADD = ['baseAdd']
const BASE_MULT = ['baseMult']
const RES_MULT = ['resMult']
const RES_ADD = ['resAdd']

export class ScaleJson {
    constructor(json?: Json.Data){
        let base = 0
        let base_add = undefined
        let base_mult = undefined
        let res_mult = undefined
        let res_add = undefined

        if (json){
            base = json.isExist(BASE) ? json.getNumber(BASE) : 0
            base_add = json.isExist(BASE_ADD) ? json.getSub(BASE_ADD) : undefined
            base_mult = json.isExist(BASE_MULT) ? json.getSub(BASE_MULT) : undefined
            res_mult = json.isExist(RES_MULT) ? json.getSub(RES_MULT) : undefined
            res_add = json.isExist(RES_ADD) ? json.getSub(RES_ADD) : undefined
        }

        this.base = base
        this.baseAdd = new ParamsJson(base_add)
        this.baseMult = new ParamsJson(base_mult)
        this.resMult = new ParamsJson(res_mult)
        this.resAdd = new ParamsJson(res_add)
    }

    copy(){
        let copy = new ScaleJson();
        (<number>copy.base) = this.base;
        (<ParamsJson>copy.baseAdd) = this.baseAdd.copy();
        (<ParamsJson>copy.baseMult) = this.baseMult.copy();
        (<ParamsJson>copy.resMult) = this.resMult.copy();
        (<ParamsJson>copy.resAdd) = this.resAdd.copy();
        return copy
    }

    /** (BASE + BASE_ADD * BASE_MULT) * RES_MULT + RES_ADD */
    getResult(params: Param.Container){
        let base = this.base
        let base_add = this.baseAdd.getResult(params)
        let base_mult = 1 + this.baseMult.getResult(params)
        let res_mult = 1 + this.resMult.getResult(params)
        let res_add = this.resAdd.getResult(params)

        return (base + base_add * base_mult) * res_mult + res_add
    }

    /** (BASE + BASE_ADD * BASE_MULT) * RES_MULT + RES_ADD */
    getFormula(prec_base: number = 0, prec_add: number = 0, prec_mult: number = 0){

        let f_base = this.base != 0 ? string.format('%.' + prec_base + 'f', this.base) : ''
        let [done_base_add, f_base_add] = this.baseAdd.getFormula(prec_add)
        let [done_base_mult, f_base_mult] = this.baseMult.getFormula(prec_mult)
        let [done_res_mult, f_res_mult] = this.resMult.getFormula(prec_mult)
        let [done_res_add, f_res_add] = this.resAdd.getFormula(prec_add)

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
    readonly baseMult: ParamsJson
    readonly baseAdd: ParamsJson
    readonly resMult: ParamsJson
    readonly resAdd: ParamsJson
}