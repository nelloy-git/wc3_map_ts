import { ActionList, Log } from '../../Utils'

import { IFace } from '../Ability/IFace'
import { SyncTargets } from './SyncTargets'
import { TargetType } from '../Utils'

export class TTargeting<T extends TargetType> {
    constructor(target_getter: (this: void, pl: jplayer, abil: IFace<T>)=>T){
        this._target_getter = target_getter
    }

    static activeInstance(pl: jplayer): Readonly<TTargeting<any>> | undefined {
        return TTargeting._active[GetPlayerId(pl)]
    }

    static activeAbility(pl: jplayer): Readonly<IFace<any>> | undefined {
        return TTargeting._abil[GetPlayerId(pl)]
    }

    start(pl: jplayer, abil: IFace<T>){
        let pl_id = GetPlayerId(pl)

        if (TTargeting._active[pl_id] != undefined || TTargeting._abil[pl_id] != undefined){
            return Log.err(TTargeting.name + 
                           ': can not start ability targeting. Another one is active.')
        }

        TTargeting._active[pl_id] = this
        TTargeting._abil[pl_id] = abil

        this._start_actions.run(this, pl, abil)
    }

    stop(pl: jplayer, abil: IFace<T>){
        let pl_id = GetPlayerId(pl)

        if (TTargeting._active[pl_id] != this || abil != TTargeting._abil[pl_id]){
            return Log.err(TTargeting.name + 
                           ': can not cancel inactive ability.', 3)
        }

        this._stop_actions.run(this, pl, abil)

        TTargeting._active[pl_id] = undefined
        TTargeting._abil[pl_id] = undefined
    }

    finish(pl: jplayer, abil: IFace<T>, target?: T){
        if (!target){target = this._target_getter(pl, abil)}
        
        this.stop(pl, abil)
        TTargeting._syncer.send(abil, target)
    }

    addAction(event: TTargeting.Event,
              callback: (this: void, instance: TTargeting<T>, pl: jplayer, abil: IFace<T>) => void){
        if (event == 'START'){
            this._start_actions.add(callback)
        } else {
            this._stop_actions.add(callback)
        }
    }

    private _target_getter: (this: void, pl: jplayer, abil: IFace<T>)=>T
    private _start_actions = new ActionList<[TTargeting<T>, jplayer, IFace<T>]>()
    private _stop_actions = new ActionList<[TTargeting<T>, jplayer, IFace<T>]>()

    private static _active: (TTargeting<any> | undefined)[] = []
    private static _abil: (IFace<TargetType> | undefined)[] = []

    private static _syncer = IsGame() ? (():SyncTargets => {
        let sync = new SyncTargets()
        sync.addAction((pl: jplayer, abil: IFace<TargetType>, target: TargetType) => {
            abil.Casting.start(target)
        })
        return sync
    })() : <SyncTargets><unknown>undefined;
}

export namespace TTargeting {
    export type Event = 'START'|'STOP'
}