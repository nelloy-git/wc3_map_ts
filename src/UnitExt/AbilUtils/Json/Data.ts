import * as Param from "../../../Parameter";
import { Cache, getFilePath, Json, Log, TextFile } from "../../../Utils";

import {ReadonlyAbilityScale, readScales} from './Scales'

let __path__ = getFilePath()

export class AbilityJsonData {
    constructor(path: string){
        if (!IsGame()){
            let f = new TextFile(path)
            // Optimize .json format
            let json = Json.decode(f.read())
            Cache.set(path, Json.encode(json))
        }
        let raw = Cache.get(path)

        this._path = path
        this._json = Json.decode(raw)
        this.name = this._readField('name', this._json, 'string')
        this.icon = this._readField('icon', this._json, 'string')
        this.dis_icon = this._readField('disIcon', this._json, 'string')
        this.tooltip = this._readField('tooltip', this._json, 'string')
        this.animations = this._readField('animations', this._json, 'object')

        this.scales = {}
        let raw_scales: {[key: string]: Json.JsonData} = this._readField('scale', this._json, 'object')
        for (let key in raw_scales){
            this.scales[key] = readScales(raw_scales[key])
        }
    }

    get(field: string){
        return this._json[field]
    }

    getValue(key: string, params?: Param.Container){
        let scale = this.scales[key]

        let base = scale.base
        let baseMult = 1
        let baseAdd = 0
        let resultMult = 1

        if (params){
            for (let p of Param.Type.list()){
                let val = params.get(p, 'RES')
                baseMult += val * scale.baseMult[p]
                baseAdd += val * scale.baseAdd[p]
                resultMult += val * scale.resultMult[p]
            }
        }

        return (base * baseMult + baseAdd) * resultMult
    }

    private _readField<T>(field: string, json: Json.JsonData, type: 'string'|'number'|'object'){
        let val = json[field]
        if (typeof val !== type){
            return Log.err('can not get field \'' + field + '\' from ' + this._path,
                           __path__, undefined, 3)
        }
        return <T><unknown>val
    }

    readonly name: string
    readonly icon: string
    readonly dis_icon: string
    readonly tooltip: string

    readonly animations: {[k: string]: number | string}
    readonly scales: {[key: string]: ReadonlyAbilityScale}

    private _path: string
    private _json: Json.JsonData
}