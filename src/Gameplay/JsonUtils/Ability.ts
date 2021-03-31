import * as Json from '../../Json'
import * as Utils from '../../Utils'
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

export class AbilityJson extends Json.Cached {
    constructor(path: string, scales?: string[], extra?: Json.Tree[]){
        super(path)

        let data = this.data
        this.name = data.getString(NAME, 'undefined')
        this.icon = data.getString(ICON, 'undefined')
        this.dis_icon = data.getString(DISICON, 'undefined')
        this.tooltip = data.getString(TOOLTIP, 'undefined')
        this.life_cost = data.getNumber(LIFE_COST, 0)
        this.mana_cost = data.getNumber(MANA_COST, 0)
        this.range = data.getNumber(RANGE, 0)
        this.area = data.getNumber(AREA, 0)
        this.charges_use = data.getNumber(CHARGES_USE, 0)
        this.charges_max = data.getNumber(CHARGES_MAX, 0)
        this.charge_cd = data.getNumber(CHARGES_CD, 0)

        this.scales = new Map()

        if (scales){
            let scales_data = data.getSub(['scales'])
            for (const name of scales){
                this.scales.set(name, new ScaleJson(scales_data.getSub([name])))
            }
        }
        
        if (extra){
            for (const tree of extra){
                if (!data.isExist(tree)){
                    return Utils.Log.err('can not find key\n' + data.tree2string(tree))
                }
            }
        }
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
}