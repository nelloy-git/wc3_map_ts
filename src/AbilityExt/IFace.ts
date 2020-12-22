import { Action } from "../Utils";
import { hUnit } from '../Handle'
import { Point } from './Point'
import { Type } from "./Type";
import { Charges } from "./Charges";

export type TargetType = (hUnit | Point)[]
export type Event = 'START' | 'CASTING' | 'CANCEL' | 'INTERRUPT' | 'FINISH'

export interface IFace {
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
              callback: (abil: IFace,
                         event: Event)=>void):
                           Action<[IFace, Event], void> | undefined

    removeAction(action: Action<[IFace, Event], void>): boolean
}

export namespace IFace {

    export function register(abil: IFace){
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
    let _id2abil = new Map<number, IFace>()
}