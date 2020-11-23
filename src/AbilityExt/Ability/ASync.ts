import { Unit } from "../../Handle";
import { Type } from "../Type";
import { AbilityTargets } from './Iface'
import { AbilitySyncing } from "./Syncing";

export abstract class AbilityASync extends AbilitySyncing{
    constructor(owner: Unit, type: Type){
        super(owner)
        this.type = type
    }

    /** Must be called for local player. */
    public targetingStart(){
        if (this.type.data.isAvailable(this)){
            this.type.targeting.start(this, AbilitySyncing._sendTargets)
        }
    }

    /** Must be called for local player. */
    public targetingCancel(){
        this.type.targeting.cancel()
    }

    /** Must be called for local player. */
    public targetingFinish(targets?: AbilityTargets){
        this.type.targeting.finish(targets)
    }

    readonly type: Type;
}