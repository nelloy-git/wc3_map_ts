import * as Abil from "../../AbilityExt";
import { Log } from "../../Utils";
import { AbilityJson } from "../JsonUtils";

export class GAbility<T extends Abil.TargetType[], UT> {
    constructor(abil: Abil.Ability<T>, path: string){
        this.json = new AbilityJson(path)
        GAbility.__abil2this.set(<any>abil, <any>this)
    }

    static get(tabil: Abil.Ability<Abil.TargetType[]>){
        let gabil = GAbility.__abil2this.get(tabil)
        if (!gabil){
            return Log.err('')
        }
        return gabil
    }

    

    json: AbilityJson
    userdata: UT | undefined

    private static __abil2this = new Map<Abil.Ability<Abil.TargetType[]>, GAbility<Abil.TargetType[], any>>()
}

Abil.Ability.addAction('NEW', (abil) => {
        let tabil = abil.type
        let type = GAbilityType.get(tabil)
        new GAbility(abil, type.json_path)
    }
)