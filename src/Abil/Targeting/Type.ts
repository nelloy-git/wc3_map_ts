import { EventActions } from '../../Utils'

import type { Abil, TargetType } from '../Abil'
import { SyncTargets } from './SyncTargets'

const SYNCER = new SyncTargets()
SYNCER.actions.add((sync, pl, [abil, targets]) => {
    abil.Casting.start(targets)
})

export class TTargeting<T extends TargetType[]> {
    constructor(func: (this: void, abil: Abil<T>) => T){
        this.actions = new EventActions(<TTargeting<T>>this, this.toString())
        this.__getTarget = func
    }

    static activeInstance(pl: jplayer): Readonly<TTargeting<TargetType[]>> | undefined {
        return TTargeting.__active[GetPlayerId(pl)]
    }

    static activeAbility(pl: jplayer): Readonly<Abil<TargetType[]>> | undefined {
        return TTargeting.__abil[GetPlayerId(pl)]
    }

    toString(){
        return this.constructor.name
    }

    start(pl: jplayer, abil: Abil<T>){
        let pl_id = GetPlayerId(pl)

        if (TTargeting.__active[pl_id] != undefined || TTargeting.__abil[pl_id] != undefined){
            error(this.toString() + ': can not start ability targeting. ' + 
                                    'Another one is active.', 2)
        }

        TTargeting.__active[pl_id] = this
        TTargeting.__abil[pl_id] = abil

        this.actions.run('START', pl, abil)
    }

    cancel(pl: jplayer, abil: Abil<T>){
        let pl_id = GetPlayerId(pl)

        if (TTargeting.__active[pl_id] != this || abil != TTargeting.__abil[pl_id]){
            error(this.toString() + ': can not stop inactive ability targeting.', 2)
        }

        this.actions.run('END', pl, abil)

        TTargeting.__active[pl_id] = undefined
        TTargeting.__abil[pl_id] = undefined
    }

    finish(pl: jplayer, abil: Abil<T>, target?: T){
        if (pl == GetLocalPlayer()){
            if (!target){
                target = this.__getTarget(abil)
            }
            SYNCER.send(pl, abil, target)
        }

        this.cancel(pl, abil)
    }

    readonly actions: EventActions<TTargeting.Event, TTargeting<T>, [jplayer, Abil<T>]>

    private __getTarget: (this: void, abil: Abil<T>) => T

    private static __active: (TTargeting<any> | undefined)[] = []
    private static __abil: (Abil<any> | undefined)[] = []
}

export namespace TTargeting {
    export type Event = 'START' | 'END'
}