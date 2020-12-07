import { Action } from "../../Utils";
import { hHandle, hTimer, hUnit } from '../../Handle'
import { Point } from '../Point'
import { Type } from "../Type";

export interface AbilityBase<TargType extends AbilityBase.TargType> {
    readonly id: number;
    readonly owner: hUnit;
    readonly type: Type<TargType>;
  
    targetingStart(pl: jplayer): void;
    targetingCancel(pl: jplayer): void;
    targetingFinish(pl: jplayer, targets?: TargType): void;

    castingStart(targets: TargType): void;
    castingPeriod(): void;
    castingCancel(): void;
    castingInterrupt(): void;
    castingFinish(): void;

    getTargets(): TargType | undefined

    addAction(event: AbilityBase.Event,
              callback: (abil: AbilityBase<TargType>,
                         event: AbilityBase.Event)=>void):
                           Action<[AbilityBase<TargType>, AbilityBase.Event], void> | undefined

    removeAction(action: Action<[AbilityBase<TargType>, AbilityBase.Event], void>): boolean
}

export namespace AbilityBase {
    export type TargType = hUnit | Point | (hUnit | Point)[]
    export type Event = 'START' | 'CASTING' | 'CANCEL' | 'INTERRUPT' | 'FINISH'

    export function register(abil: AbilityBase<TargType>){
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
    let _id2abil = new Map<number, AbilityBase<TargType>>()
}