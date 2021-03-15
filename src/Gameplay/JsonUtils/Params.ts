import * as Json from '../../Json'
import * as Param from "../../Parameter";

export class ParamsJson {
    constructor(json: LuaTable, default_val?: number){
        this._def = default_val ? default_val : 0

        for (let param of Param.Type.list()){
            let val = Json.Read.Number(json, param)
            this.values.set(param, val ? val : this._def)
        }
    }

    get(param: Param.Type){
        let v = this.values.get(param)
        return v ? v : this._def
    }

    getResult(params: Param.Container){
        let res = 0

        for (let p of Param.Type.list()){
            let v = this.values.get(p)
            if (v){
                res += params.get(p, 'RES') * v
            }
        }

        return res
    }

    readonly values = new Map<Param.Type, number>()

    private _def: number
}