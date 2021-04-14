import * as Json from '../../../src/Json'
import * as Utils from '../../../src/Utils'
import * as Param from "../../Parameter";

import { ScaleJson } from './Scales'

let __path__ = Macro(Utils.getFilePath())

const NAME = ['name']
const ICON = ['icon']
const DISICON = ['disIcon']
const TOOLTIP = ['tooltip']
const LIFE_COST = ['lifeCost']
const MANA_COST = ['manaCost']
const RANGE = ['range']
const AREA = ['area']
const CHARGES_USE = ['chargesUse']
const CHARGES_MAX = ['chargesMax']
const CHARGES_CD = ['chargeCD']

const DEFAULT_TOOLTIP_LIST = new Json.Data('AbilityJsonDefaultTooltip', (() => {
    let tbl = new LuaTable()
    tbl.set(1, 'undefined')
    return tbl
})())

export class AbilityJson {
    static load(json: Json.Data, scales?: string[], extra?: Json.Tree[]){
        let abil_json = new AbilityJson()
        abil_json.name = json.getString(NAME, 'undefined')
        abil_json.icon = json.getString(ICON, 'undefined')
        abil_json.dis_icon = json.getString(DISICON, 'undefined')
        abil_json.life_cost = json.getNumber(LIFE_COST, 0)
        abil_json.mana_cost = json.getNumber(MANA_COST, 0)
        abil_json.range = json.getNumber(RANGE, 0)
        abil_json.area = json.getNumber(AREA, 0)
        abil_json.charges_use = json.getNumber(CHARGES_USE, 0)
        abil_json.charges_max = json.getNumber(CHARGES_MAX, 0)
        abil_json.charge_cd = json.getNumber(CHARGES_CD, 0)

        let tooltip_list = json.getSub(TOOLTIP, DEFAULT_TOOLTIP_LIST)
        abil_json.tooltip = ''
        let i = 1
        while(tooltip_list.isExist([i])){
            abil_json.tooltip += tooltip_list.getString([i], '')
            i++
        }

        if (scales){
            let scales_data = json.getSub(['scales'])
            for (const name of scales){
                abil_json.scales.set(name, new ScaleJson(scales_data.getSub([name])))
            }
        }
        
        if (extra){
            for (const tree of extra){
                if (!json.isExist(tree)){
                    return Utils.Log.err('can not find key\n' + json.tree2string(tree))
                }
                let val = json.getAny(tree)
                if (typeof val === 'object'){
                    return Utils.Log.err('extra value can not be of type "object"\n' + json.tree2string(tree))
                }
                abil_json.extra.set(tree, val)
            }
        }

        return abil_json
    }

    copy(){
        let copy = new AbilityJson()
        copy.name = this.name
        copy.icon = this.icon
        copy.dis_icon = this.dis_icon
        copy.tooltip = this.tooltip
        copy.life_cost = this.life_cost
        copy.mana_cost = this.mana_cost
        copy.range = this.range
        copy.area = this.area
        copy.charges_use = this.charges_use
        copy.charges_max = this.charges_max
        copy.charge_cd = this.charge_cd

        for (let [k, v] of this.scales){
            copy.scales.set(k, v.copy())
        }

        for (let [k, v] of this.extra){
            copy.extra.set(k, v)
        }

        return copy
    }

    getScaled(name: string, params?: Param.UnitContainer){
        let scale = this.scales.get(name)
        if (!scale){
            return Utils.Log.err('can not find scale ' + name)
        }

        if (!params){
            return Utils.Log.err('empty params for scale ' + name)
        }

        return scale.getResult(params)
    }

    getFormula(name: string, prec_base: number = 0, prec_add: number = 0, prec_mult: number = 0){
        let scale = this.scales.get(name)
        if (!scale){
            return '{' + name + '}'
        }

        return scale.getFormula(prec_base, prec_add, prec_mult)
    }

    private constructor(){
        this.name = 'undefined'
        this.icon = 'undefined'
        this.dis_icon = 'undefined'
        this.tooltip = 'undefined'
        this.life_cost = 0
        this.mana_cost = 0
        this.range = 0
        this.area = 0
        this.charges_use = 0
        this.charges_max = 0
        this.charge_cd = 0
        this.scales = new Map()
        this.extra = new Map()
    }

    name: string
    icon: string
    dis_icon: string
    tooltip: string
    life_cost: number
    mana_cost: number
    range: number
    area: number
    charges_use: number 
    charges_max: number
    charge_cd: number

    scales: Map<string, ScaleJson>
    extra: Map<Json.Tree, any>
}