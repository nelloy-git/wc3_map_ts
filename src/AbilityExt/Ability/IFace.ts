import { Action } from "../../Utils";
import { hUnit } from '../../Handle'
import { Point } from '../Point'
import { Type } from "../Type";
import { Charges } from "../Charges";

export type TargetType = (hUnit | Point)[]
export type Event = 'START' | 'CASTING' | 'CANCEL' | 'INTERRUPT' | 'FINISH'

export interface AbilityIFace {
    readonly id: number;
    readonly owner: hUnit;
    readonly type: Type<any>;
    readonly charges: Charges;
  
    targetingStart(pl: jplayer): void;
    targetingCancel(pl: jplayer): void;
    targetingFinish(pl: jplayer, targets?: TargetType): void;

    castingStart(targets: TargetType): void;
    castingPeriod(): void;
    castingCancel(): void;
    castingInterrupt(): void;
    castingFinish(): void;

    getTarget(): TargetType;

    addAction(event: Event,
              callback: (abil: AbilityIFace,
                         event: Event)=>void):
                           Action<[AbilityIFace, Event], void> | undefined

    removeAction(action: Action<[AbilityIFace, Event], void>): boolean
}

export namespace AbilityIFace {

    export function register(abil: AbilityIFace){
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
    let _id2abil = new Map<number, AbilityIFace>()
}