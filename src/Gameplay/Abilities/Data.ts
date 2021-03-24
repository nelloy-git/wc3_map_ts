import * as Abil from "../../AbilityExt";
import * as Json from '../../Json'
import { getFilePath, Log } from "../../Utils";

import { AbilityJson, KeysTree } from "../JsonUtils"
export { KeysTree }

const __path__ = Macro(getFilePath())

export class AbilityData<T extends Abil.TargetType[]> extends Abil.TData<T> {
    constructor(path: string){
        super()

        this.name = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).name}
        this.icon = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).icon}
        this.dis_icon = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).dis_icon}
        this.tooltip = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).tooltip}
        this.life_cost = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).life_cost}
        this.mana_cost = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).mana_cost}
        this.range = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).range}
        this.area = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).area}
        this.charges_use = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).charges_use}
        this.charges_max = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).charges_max}
        this.charge_cd = (abil: Abil.IFace<T>)=>{return AbilityData.getJson(abil).charge_cd}
        this.is_available = (abil: Abil.IFace<T>)=>{return true}
        this.consume = (abil: Abil.IFace<T>, target: T)=>{return true}

        this.__json_path = path
        // Cache source json
        this.__json_file = new AbilityJson(path)
    }

    checkTree(trees: KeysTree[]){
        for (const tree of trees){
            let cur = this.__json_file.raw
            for (let i = 0; i < tree.length - 1; i++){
                let next = Json.Read.Table(cur, tree[i], {}, this.__json_path)
                if (!next){
                    let msg = 'checkExtraKey failed for \n' + this.__json_path
                    for (let j = 0; j < i; j++){
                        msg += ' -> ' + tree[j]
                    }
                    return Log.err(msg, __path__, AbilityData, 2)
                }
                cur = next
            }

            let val = Json.Read.Any(cur, tree[tree.length - 1])
            if (val == undefined){
                let msg = 'checkExtraKey failed for \n' + this.__json_path
                for (let j = 0; j < tree.length; j++){
                    msg += ' -> ' + tree[j]
                }
                return Log.err(msg, __path__, AbilityData, 2)
            }
        }
    }

    checkScale(names: KeysTree){
        for (const name of names){
            let scale = this.__json_file.scales.get(name)
            if (scale == undefined){
                return Log.err('checkScale failed for\n' + this.__json_path + ' -> ' + name,
                                __path__, AbilityData, 2)
            }
        }
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

    static getJson(abil: Abil.IFace<Abil.TargetType[]>): AbilityJson{
        let data = AbilityData.__abil2json.get(abil)
        if (!data){
            let abil_tdata = (<Abil.Ability<Abil.TargetType[]>>abil).Data.type
            if (abil_tdata instanceof AbilityData){
                data = new AbilityJson(abil_tdata.__json_path)
            }
            
            if (!data){
                return Log.err('Can not get ability json template.')
            }

            AbilityData.__abil2json.set(abil, data)
        }
        return data
    }

    private __json_path: string
    private __json_file: AbilityJson

    private static __abil2json = new Map<Abil.IFace<Abil.TargetType[]>, AbilityJson>()
}