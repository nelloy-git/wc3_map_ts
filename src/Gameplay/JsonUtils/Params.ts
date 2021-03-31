import * as Json from '../../Json'
import * as Param from "../../Parameter";

export class ParamsJson {
    constructor(json: Json.Data, default_val: number){
        this._def = default_val

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
        return v ? v : this._def
    }

    getResult(params: Param.Container){
        let res = this._def

        for (let [p, v] of this.values){
            res += params.get(p, 'RES') * v
        }

        return res
    }

    getFormula(percent: boolean = false, prec: number = 0){
        let f = ''

        let tmp = ' + %.' + prec + 'f' + (percent ? '%%' : '') + ' * %s'
        let k = percent ? 100 : 1
        for (let [p, v] of this.values){
            f += string.format(tmp, k * v, p)
        }

        return f.substr(3)
    }

    readonly values = new Map<Param.Type, number>()

    private _def: number
}