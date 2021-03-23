import * as Abil from "../../AbilityExt";
import { Log } from "../../Utils";

import { AbilityJson } from "../JsonUtils"

export class AbilityData<T extends Abil.TargetType[]> extends Abil.TData<T> {
    constructor(path: string){
        super()

        this.__json_path = path
        this.__json_file = new AbilityJson(path)
    }

    static get(abil: Abil.Ability<Abil.TargetType[]>){
        let data = AbilityData.__abil2json.get(abil)
        if (!data){
            let abil_tdata = abil.type.TData
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

    private static __abil2json = new Map<Abil.Ability<Abil.TargetType[]>, AbilityJson>()
}