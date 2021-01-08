import { Action, ActionList } from "../../Utils";
import { TTargeting } from "../Type/Targeting";
import { TargetType } from "../Utils";
import { IFace, TargetingIFace } from "./IFace";

export class Targeting<T extends TargetType> implements TargetingIFace<T> {
    constructor(abil: IFace<T>, type: TTargeting<T>){
        this.abil = abil
        this._type = type
    }

    start(pl: jplayer){
        if (this.abil.Data.is_available){
            this._type.start(pl, this.abil)
        }
    }

    cancel(pl: jplayer){
        this._type.stop(pl, this.abil)
    }

    finish(pl: jplayer, target?: T){
        this._type.finish(pl, this.abil, target)
    }

    addAction(event: Targeting.Event,
              callback: (this: void, abil: IFace<T>, event: Targeting.Event, target: T)=>void){
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[IFace<T>, Targeting.Event], void>){
        for (let [event, list] of this._actions){
            if (list.remove(action)){return true}
        }
        return false
    }

    readonly abil: IFace<T>

    private _type: TTargeting<T>
    private _actions = new Map<Targeting.Event, ActionList<[IFace<T>, Targeting.Event, T]>>([
        ['TARG_START', new ActionList()],
        ['TARG_STOP', new ActionList()],
    ])
}

export namespace Targeting {
    export type Event = 'TARG_START'|'TARG_STOP'
}