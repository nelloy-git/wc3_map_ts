import * as Abil from "../../AbilityExt";
import * as Json from '../../Json'
import * as Param from '../../Parameter'
import { getFilePath, Log } from "../../Utils";

import { AbilityJson } from "../JsonUtils"

const __path__ = Macro(getFilePath())

export function getJson(abil: Abil.IFace<any>){
    return AbilityData.getJson(abil)
}

export class AbilityData<T extends Abil.TargetType[]> extends Abil.TData<T> {
    constructor(path: string, scales?: string[], extra?: Json.Tree[]){
        super()
        // Cache source json
        this.__json_file = new AbilityJson(path, scales, extra)

        this.name = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).name}
        this.icon = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).icon}
        this.dis_icon = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).dis_icon}
        this.tooltip = (abil: Abil.IFace<T>, full: boolean)=>{return this.__getTooltip(abil, full)}
        this.life_cost = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).life_cost}
        this.mana_cost = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).mana_cost}
        this.range = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).range}
        this.area = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).area}
        this.charges_use = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).charges_use}
        this.charges_max = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).charges_max}
        this.charge_cd = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).charge_cd}
        this.is_available = (abil: Abil.IFace<T>)=>{return true}
        this.consume = (abil: Abil.IFace<T>, target: T)=>{return true}

        this.__scale_names = []
        if (scales){
            for (const name of scales){
                this.__scale_names.push(name)
            }
        }
    }

    static getJson(abil: Abil.IFace<Abil.TargetType[]>): AbilityJson{
        let data = AbilityData.__abil2json.get(abil)
        if (!data){
            let abil_tdata = (<Abil.Ability<Abil.TargetType[]>>abil).Data.type
            if (abil_tdata instanceof AbilityData){
                // Copy without checks
                data = new AbilityJson(abil_tdata.__json_file.data.src, abil_tdata.__scale_names)
            }
            
            if (!data){
                return Log.err('Can not get ability json template.')
            }

            AbilityData.__abil2json.set(abil, data)
        }
        return data
    }

    get is_available(){return this._is_available}
    set is_available(f: (abil: Abil.IFace<T>)=> boolean){
        let wrapped = (abil: Abil.IFace<T>) => {
            return !abil.Data.owner.pause &&
                    abil.Data.owner.mana >= abil.Data.mana_cost &&
                    abil.Data.owner.life >= abil.Data.life_cost + 1 &&
                    abil.Data.Charges.count >= abil.Data.charges_use &&
                    Abil.Casting.getActive(abil.Data.owner) == undefined &&
                    f(abil)
        }

        this._is_available = wrapped
    }

    get consume(){return this._consume}
    set consume(f: (abil: Abil.IFace<T>, target: T)=> boolean){
        let wrapped = (abil: Abil.IFace<T>, target: T) => {
            abil.Data.Charges.count -= abil.Data.charges_use
            abil.Data.owner.mana -= abil.Data.mana_cost
            abil.Data.owner.life -= abil.Data.life_cost
            return f(abil, target)
        }

        this._consume = wrapped
    }

    private __getTooltip(abil: Abil.IFace<T>, full: boolean){
        let json = AbilityData.getJson(abil)
        let params = Param.UnitContainer.get(abil.Data.owner)

        let tmp_tooltip = json.tooltip
        let [tooltip, _] = string.gsub(tmp_tooltip, '%b{}', (match: string) => {
            let field = match.slice(1, -1).split(':')
            let key = field[0]
            let prec_base = field[1] ? tonumber(field[1]) : 0
            let prec_add = field[2] ? tonumber(field[2]) : 0
            let prec_mult = field[3] ? tonumber(field[3]) : 0

            let scale = json.scales.get(key)
            let val = ''
            if (scale){
                val = string.format('%.0f', json.getScaled(key, params))
                match = full ? json.getFormula(key, prec_base, prec_add, prec_mult) : ''
            }
            return val + ' ' + match
        })
        return tooltip
    }

    private __scale_names: string[]
    private __json_file: AbilityJson
    private static __abil2json = new Map<Abil.IFace<Abil.TargetType[]>, AbilityJson>()
}