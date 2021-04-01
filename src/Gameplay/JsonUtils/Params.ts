import * as Json from '../../Json'
import * as Param from "../../Parameter";

export class ParamsJson {
    constructor(json: Json.Data, default_val: number){
        this.__def = default_val

        let silent = json.silent

        json.silent = true
        for (let param of Param.Type.list()){
            if (json.isExist([param])){
                this.values.set(param, json.getNumber([param]))
            }
        }
        json.silent = silent
    }

    get(param: Param.Type){
        let v = this.values.get(param)
        return v ? v : this.__def
    }

    getResult(params: Param.Container){
        let res = 0
        for (let [p, v] of this.values){
            res += params.get(p, 'RES') * v
        }
        return res
    }

    getFormula(prec: number = 0){
        if (this.values.size == 0){
            return [false, '']
        }

        let f = ''
        let fmt = ' + %.' + prec + 'f * %s'

        for (let [p, v] of this.values){
            f += string.format(fmt, v, p)
        }

        return [true, f.substr(3)]
    }

    readonly values = new Map<Param.Type, number>()

    private __def: number
}