import { Unit } from "../../Handle";
import { Action } from "../../Utils";
import { Point } from '../Point'

export type AbilityTargets = (Unit | Point)[]
export type AbilityEvent = 'START' | 'CASTING' | 'CANCEL' | 'INTERRUPT' | 'FINISH'

export interface AbilityIface {
    targetingStart(): void;
    targetingCancel(): void;
    targetingFinish(targets: AbilityTargets): void;

    castingPeriod(): void;
    castingCancel(): void;
    castingInterrupt(): void;
    castingFinish(): void;

    addAction(event: AbilityEvent,
              callback: (abil: AbilityIface,
                         event: AbilityEvent)=>void):
                            Action<[AbilityIface, AbilityEvent], void> | undefined

    removeAction(action: Action<[AbilityIface, AbilityEvent], void>): boolean

    readonly owner: Unit;
    readonly id: number;
    
    targets: AbilityTargets | undefined
}