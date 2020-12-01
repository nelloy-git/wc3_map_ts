import { Action } from "../../Utils";
import { Unit } from '../../Handle'
import { Point } from '../Point'
import { Type } from "../Type";

export type Targets = (Unit | Point)[]
export type Event = 'START' | 'CASTING' | 'CANCEL' | 'INTERRUPT' | 'FINISH'

export interface AbilityBase {
    readonly id: number;
    readonly owner: Unit;
    readonly type: Type;
  
    targetingStart(pl: jplayer): void;
    targetingCancel(pl: jplayer): void;
    targetingFinish(pl: jplayer, targets?: Targets): void;

    castingStart(targets: Targets): void;
    castingPeriod(): void;
    castingCancel(): void;
    castingInterrupt(): void;
    castingFinish(): void;

    getTargets(): Targets | undefined

    addAction(event: Event,
                       callback: (abil: AbilityBase,
                                  event: Event)=>void):
                                    Action<[AbilityBase, Event], void> | undefined

    removeAction(action: Action<[AbilityBase, Event], void>): boolean
}

export namespace AbilityBase {
    export function register(abil: AbilityBase){
        let id = newId()
        _id2abil.set(id, abil)
        return id
    }

    export function get(id: number){
        return _id2abil.get(id)
    }

    let _last_id = 0
    function newId(){
        _last_id += 1
        return _last_id
    }
    let _id2abil = new Map<number, AbilityBase>()
}