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
        this._raw = raw

        this.name = Json.Read.String(raw, 'name', 'unfined', path)
        this.icon = Json.Read.String(raw, 'icon', 'unfined', path)
        this.dis_icon = Json.Read.String(raw, 'disIcon', 'unfined', path)
        this.tooltip = Json.Read.String(raw, 'tooltip', 'unfined', path)

        this.scales = new Map()
        let raw_scales = Json.Read.Table(raw, 'scales', {}, path)
        for (let key in raw_scales){
            this.scales.set(key, new ScaleJson(Json.Read.Table(raw_scales, key, {}, path + '::' + key)))
        }
    }

    getNumber(key_tree: string[]){
        let cur: LuaTable = this._raw
        for (let i = 0; i < key_tree.length - 1; i++){
            let next = Json.Read.Table(cur, key_tree[i])
            if (!next){return undefined}
            cur = next
        }

        return Json.Read.Number(cur, key_tree[key_tree.length - 1])
    }

    readonly name: string
    readonly icon: string
    readonly dis_icon: string
    readonly tooltip: string
    readonly scales: Map<string, ScaleJson>

    protected readonly _raw: LuaTable
}