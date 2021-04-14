import * as Abil from "../../AbilityExt";
import * as Param from '../../Parameter'
import { Color, Log } from "../../../src/Utils";

import { AbilityJson } from "../JsonUtils"

export function getJson(abil: Abil.IFace<any>){
    return AbilityData.getJson(abil)
}

const FORMULA_COLOR = new Color(0.8, 0.8, 0.8, 1)

export class AbilityData<T extends Abil.TargetType[]> extends Abil.TData<T> {
    constructor(prototype: AbilityJson){
        super()
        this.__abil_json_prototype = prototype

        this.name = (abil) => {return AbilityData.getJson(abil).name}
        this.icon = (abil) => {return AbilityData.getJson(abil).icon}
        this.dis_icon = (abil) => {return AbilityData.getJson(abil).dis_icon}
        this.tooltip = (abil, full) => {return this.__getTooltip(abil, full)}
        this.life_cost = (abil) => {return AbilityData.getJson(abil).life_cost}
        this.mana_cost = (abil) => {return AbilityData.getJson(abil).mana_cost}
        this.range = (abil) => {return AbilityData.getJson(abil).range}
        this.area = (abil) => {return AbilityData.getJson(abil).area}
        this.charges_use = (abil) => {return AbilityData.getJson(abil).charges_use}
        this.charges_max = (abil) => {return AbilityData.getJson(abil).charges_max}
        this.charge_cd = (abil) => {return AbilityData.getJson(abil).charge_cd}
        this.is_available = (abil) => {return true}
        this.consume = (abil, target) => {return true}
    }

    static getJson(abil: Abil.IFace<Abil.TargetType[]>): AbilityJson{
        let data = AbilityData.__abil2json.get(abil)
        if (!data){
            let abil_tdata = (<Abil.Ability<Abil.TargetType[]>>abil).Data.type
            if (abil_tdata instanceof AbilityData){
                // Copy prototype
                data = abil_tdata.__abil_json_prototype.copy()
            }
            
            if (!data){
                return Log.err('Can not get ability json template.')
            }

            AbilityData.__abil2json.set(abil, data)
        }
        return data
    }

    get is_available(){return this._is_available}
    set is_available(f: (abil: Abil.IFace<T>)=> boolean){
        let wrapped = (abil: Abil.IFace<T>) => {
            return !abil.Data.owner.pause &&
                    abil.Data.owner.mana >= abil.Data.mana_cost &&
                    abil.Data.owner.life >= abil.Data.life_cost + 1 &&
                    abil.Data.Charges.count >= abil.Data.charges_use &&
                    Abil.Casting.getActive(abil.Data.owner) == undefined &&
                    f(abil)
        }

        this._is_available = wrapped
    }

    get consume(){return this._consume}
    set consume(f: (abil: Abil.IFace<T>, target: T)=> boolean){
        let wrapped = (abil: Abil.IFace<T>, target: T) => {
            abil.Data.Charges.count -= abil.Data.charges_use
            abil.Data.owner.mana -= abil.Data.mana_cost
            abil.Data.owner.life -= abil.Data.life_cost
            return f(abil, target)
        }

        this._consume = wrapped
    }

    private __getTooltip(abil: Abil.IFace<T>, full: boolean){
        let json = AbilityData.getJson(abil)
        let params = Param.UnitContainer.get(abil.Data.owner)

        let template = json.tooltip
        let [tooltip, _] = string.gsub(template, '%b{}', (match: string) => {
            let field = match.slice(1, -1).split(':')
            let key = field[0]
            let prec_res = field[1] ? tonumber(field[1]) : 0
            let prec_base = field[2] ? tonumber(field[2]) : 0
            let prec_add = field[3] ? tonumber(field[3]) : 0
            let prec_mult = field[4] ? tonumber(field[4]) : 0

            let val = ''
            if (json.scales.get(key)){
                val = string.format('%.' + prec_res + 'f', json.getScaled(key, params))
                match = full ? FORMULA_COLOR.colorText(json.getFormula(key, prec_base, prec_add, prec_mult)) : ''
            }
            return val + ' ' + match
        })
        return tooltip
    }

    private __abil_json_prototype: AbilityJson
    
    private static __abil2json = new Map<Abil.IFace<Abil.TargetType[]>, AbilityJson>()
}