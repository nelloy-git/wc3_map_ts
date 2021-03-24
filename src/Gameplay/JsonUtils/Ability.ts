import * as Json from '../../Json'
import * as Utils from '../../Utils'

import { ScaleJson } from './Scales'

let __path__ = Macro(Utils.getFilePath())

export class AbilityJson extends Json.FileCached {
    constructor(path: string){
        super(path)

        let data = this._file.data
        if (!data){
            Utils.Log.err(path + ' is empty', __path__, AbilityJson)
        }

        let raw = Json.decode(<string>data)
        this.raw = raw

        this.name = Json.Read.String(raw, 'name', 'unfined', path)
        this.icon = Json.Read.String(raw, 'icon', 'unfined', path)
        this.dis_icon = Json.Read.String(raw, 'disIcon', 'unfined', path)
        this.tooltip = Json.Read.String(raw, 'tooltip', 'unfined', path)
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

    getNumber(key_tree: string[]){
        let cur: LuaTable = this.raw
        for (let i = 0; i < key_tree.length - 1; i++){
            let next = Json.Read.Table(cur, key_tree[i])
            if (!next){return undefined}
            cur = next
        }

        return Json.Read.Number(cur, key_tree[key_tree.length - 1])
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