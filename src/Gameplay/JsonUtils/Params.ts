import * as Json from '../../Json'
import * as Param from "../../Parameter";

export class ParamsJson {
    constructor(json: Json.Data, default_val: number){
        this._def = default_val

        let silent = json.silent

        json.silent = true
        for (let param of Param.Type.list()){
            this.values.set(param, json.getNumber([param], default_val))
        }
        json.silent = silent
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