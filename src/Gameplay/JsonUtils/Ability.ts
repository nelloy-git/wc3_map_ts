import * as Json from '../../Json'
import * as Utils from '../../Utils'
import * as Param from "../../Parameter";

import { ScaleJson } from './Scales'

let __path__ = Macro(Utils.getFilePath())

export type KeysTree = ReadonlyArray<string>;

export class AbilityJson extends Json.FileCached {
    constructor(path: string){
        super(path)

        let data = this._file.data
        if (!data){
            Utils.Log.err(path + ' is empty', __path__, AbilityJson)
        }

        let raw = Json.decode(<string>data)
        this.raw = raw

        this.name = Json.Read.String(raw, 'name', 'undefined', path)
        this.icon = Json.Read.String(raw, 'icon', 'undefined', path)
        this.dis_icon = Json.Read.String(raw, 'disIcon', 'undefined', path)
        this.tooltip = Json.Read.String(raw, 'tooltip', 'undefined', path)
        this.life_cost = Json.Read.Number(raw, 'lifeCost', 0, path)
        this.mana_cost = Json.Read.Number(raw, 'manaCost', 0, path)
        this.range = Json.Read.Number(raw, 'range', 0, path)
        this.area = Json.Read.Number(raw, 'area', 0, path)
        this.charges_use = Json.Read.Number(raw, 'chargesUse', 0, path)
        this.charges_max = Json.Read.Number(raw, 'chargesMax', 0, path)
        this.charge_cd = Json.Read.Number(raw, 'chargeCD', 0, path)

        this.scales = new Map()
        let raw_scales = Json.Read.Table(raw, 'scales', {}, path)
        for (let key in raw_scales){
            this.scales.set(key, new ScaleJson(Json.Read.Table(raw_scales, key, {}, path + '::' + key)))
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

    getNumber(key_tree: KeysTree, def: number){
        let cur: LuaTable = this.raw
        for (let i = 0; i < key_tree.length - 1; i++){
            let next = Json.Read.Table(cur, key_tree[i])
            if (!next){
                return Utils.Log.err('key tree does not exits in ' + this.path)
            }
            cur = next
        }

        return Json.Read.Number(cur, key_tree[key_tree.length - 1], def)
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
    raw: LuaTable
}