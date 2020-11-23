import { Action } from "../../Utils";
import { Unit } from '../../Handle'
import { AbilityEvent, AbilityIface, AbilityTargets } from './Iface'

let last_id = 0
function newId(){
    last_id += 1
    return last_id
}

export abstract class AbilityBase implements AbilityIface {
    constructor(owner: Unit){
        this.owner = owner
        this.id = newId()
        AbilityBase._id2abil.set(this.id, this)
    }
    protected static get(id: number){
        return AbilityBase._id2abil.get(id)
    }

    public readonly owner: Unit;
    public readonly id: number;

    private static _id2abil = new Map<number, AbilityBase>()

    // No implementation   
    abstract targetingStart(): void;
    abstract targetingCancel(): void;
    abstract targetingFinish(targets?: AbilityTargets): void;

    abstract castingPeriod(): void;
    abstract castingCancel(): void;
    abstract castingInterrupt(): void;
    abstract castingFinish(): void;

    abstract addAction(event: AbilityEvent,
              callback: (abil: AbilityIface,
                         event: AbilityEvent)=>void):
                            Action<[AbilityIface, AbilityEvent], void> | undefined

    abstract removeAction(action: Action<[AbilityIface, AbilityEvent], void>): boolean

    abstract get targets(): AbilityTargets | undefined
}