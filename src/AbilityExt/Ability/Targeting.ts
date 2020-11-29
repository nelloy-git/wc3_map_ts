import { Unit } from "../../Handle";
import { Type } from "../Type";
import { AbilityBase, AbilityTargets } from './Base'

export abstract class AbilityTargeting extends AbilityBase{
    constructor(owner: Unit, type: Type){
        super(owner)
        this.type = type
    }

    public targetingStart(pl: jplayer){
        if (this.type.data.isAvailable(this)){
            this.type.targeting.start(pl, this)
        }
    }

    public targetingCancel(pl: jplayer){
        this.type.targeting.cancel(pl)
    }

    public targetingFinish(pl: jplayer, targets?: AbilityTargets){
        this.type.targeting.finish(pl, targets)
    }



    readonly type: Type;
}