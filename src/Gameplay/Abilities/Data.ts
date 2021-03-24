import * as Abil from "../../AbilityExt";
import { Log } from "../../Utils";

import { AbilityJson } from "../JsonUtils"

export class AbilityData<T extends Abil.TargetType[]> extends Abil.TData<T> {
    constructor(path: string){
        super()

        this.__json_path = path

        // Cache source json
        this.__json_file = new AbilityJson(path)
    }

    get name(){
        return (abil: Abil.IFace<T>)=>{
            return AbilityData.get(abil).name
        }
    }

    get icon_normal(){
        return (abil: Abil.IFace<T>)=>{
            return AbilityData.get(abil).icon
        }
    }

    get icon_disabled(){
        return (abil: Abil.IFace<T>)=>{
            return AbilityData.get(abil).dis_icon
        }
    }

    get life_cost(){
        return (abil: Abil.IFace<T>)=>{
            return AbilityData.get(abil).life_cost
        }
    }

    get mana_cost(){
        return (abil: Abil.IFace<T>)=>{
            return AbilityData.get(abil).mana_cost
        }
    }

    get range(){
        return (abil: Abil.IFace<T>)=>{
            return AbilityData.get(abil).range
        }
    }

    get charges_use(){
        return (abil: Abil.IFace<T>)=>{
            return AbilityData.get(abil).charges_use
        }
    }

    get charges_max(){
        return (abil: Abil.IFace<T>)=>{
            return AbilityData.get(abil).charges_max
        }
    }

    get charge_cd(){
        return (abil: Abil.IFace<T>)=>{
            return AbilityData.get(abil).charge_cd
        }
    }

    private static get(abil: Abil.IFace<Abil.TargetType[]>): AbilityJson{
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