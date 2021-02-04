import * as Param from "../Parameter";
import { Cache, getFilePath, Json, Log, TextFile } from "../Utils";
// import { JsonHash } from "../Utils/Json";

let __filepath__ = getFilePath()

type AbilityDamage = {
    base: number
    baseMult: Map<Param.Type, number>
    baseAdd: Map<Param.Type, number>
    resultMult: Map<Param.Type, number>
}

export class AbilityJson {
    constructor(path: string){
        if (!IsGame()){
            let f = new TextFile(path)
            Cache.set(path, f.read())
        }
        let raw = Cache.get(path)

        this._json = Json.decode(raw)
        this.name = this._readField('name', this._json, 'string')
        this.icon = this._readField('icon', this._json, 'string')
        this.dis_icon = this._readField('disIcon', this._json, 'string')
        this.tooltip = this._readField('tooltip', this._json, 'string')
    }

    get(field: string){
        return this._json[field]
    }

    private _readField<T>(field: string, json: JsonHash, type: 'string'|'number'){
        let val = json[field]
        if (typeof val !== type){
            return Log.err(__filepath__ + AbilityJson.name + 
                           ': json file does not have field \"' + field + '\" or it has wront type.')
        }
        return <T><unknown>val
    }

    private _readDamage(){
        let raw = this._json['damage']
        let base = raw['base']

    }

    readonly name: string
    readonly icon: string
    readonly dis_icon: string
    readonly tooltip: string

    private _json: JsonHash
}