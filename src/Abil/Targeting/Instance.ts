import { EventActions } from '../../Utils'

import type { Abil, TargetType } from '../Abil'
import type { TTargeting } from "./Type";
// import { IFace, TargetingEvent, TargetingIFace, TargetType } from "../Ability/IFace";

export class Targeting<T extends TargetType[]> {
    constructor(abil: Abil<T>, type: TTargeting<T>){
        this.abil = abil
        this.actions = new EventActions(<Targeting<T>>this, this.toString())
        
        this.__type = type
    }

    toString(){
        return this.abil.toString() + '.' + this.constructor.name
    }

    start(pl: jplayer){
        if (!this.abil.Data.is_available){
            return false
        }

        this.__type.start(pl, this.abil)
        this.actions.run('START', pl)
        return true
    }

    cancel(pl: jplayer){
        this.__type.cancel(pl, this.abil)
        this.actions.run('CANCEL', pl)
    }

    finish(pl: jplayer, target?: T){
        this.__type.finish(pl, this.abil, target)
        this.actions.run('FINISH', pl)
    }

    readonly abil: Abil<T>
    readonly actions: EventActions<Targeting.Event, Targeting<T>, [jplayer]>

    private __type: TTargeting<T>
}

export namespace Targeting {
    export type Event = 'START' | 'CANCEL' | 'FINISH'
}