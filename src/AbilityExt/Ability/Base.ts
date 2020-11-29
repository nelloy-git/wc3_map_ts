import { Action } from "../../Utils";
import { Unit } from '../../Handle'
import { Point } from '../Point'

export type AbilityTargets = (Unit | Point)[]
export type AbilityEvent = 'START' | 'CASTING' | 'CANCEL' | 'INTERRUPT' | 'FINISH'

export abstract class AbilityBase {
    constructor(owner: Unit){
        this.owner = owner
        this.id = AbilityBase.newId()
        AbilityBase._id2abil.set(this.id, this)
    }
    public static get(id: number){
        return AbilityBase._id2abil.get(id)
    }

    public readonly owner: Unit;
    public readonly id: number;

    private static _id2abil = new Map<number, AbilityBase>()

    // No implementation   
    abstract targetingStart(pl: jplayer): void;
    abstract targetingCancel(pl: jplayer): void;
    abstract targetingFinish(pl: jplayer, targets?: AbilityTargets): void;

    abstract castingStart(targets: AbilityTargets): void;
    abstract castingPeriod(): void;
    abstract castingCancel(): void;
    abstract castingInterrupt(): void;
    abstract castingFinish(): void;

    abstract get targets(): AbilityTargets | undefined

    abstract addAction(event: AbilityEvent,
                       callback: (abil: AbilityBase,
                                  event: AbilityEvent)=>void):
                                     Action<[AbilityBase, AbilityEvent], void> | undefined

    abstract removeAction(action: Action<[AbilityBase, AbilityEvent], void>): boolean

    private static _last_id = 0
    private static newId(){
        AbilityBase._last_id += 1
        return AbilityBase._last_id
    }
}