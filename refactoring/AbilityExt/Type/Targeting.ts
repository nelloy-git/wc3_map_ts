import { getFilePath, ActionList, Log } from '../../../src/Utils'

import { IFace, TargetType } from '../Ability/IFace'
import { SyncTargets } from './SyncTargets'

let __path__ = Macro(getFilePath())

const SYNCER = new SyncTargets()
SYNCER.addAction((pl: jplayer, abil: IFace<TargetType[]>, target: TargetType[]) => {
    abil.Casting.start(target)
})

export class TTargeting<T extends TargetType[]> {
    constructor(func: TTargeting.GetLocalTarget<T>){
        this.__getTarget = func
    }

    static activeInstance(pl: jplayer): Readonly<TTargeting<TargetType[]>> | undefined {
        return TTargeting.__active[GetPlayerId(pl)]
    }

    static activeAbility(pl: jplayer): Readonly<IFace<TargetType[]>> | undefined {
        return TTargeting.__abil[GetPlayerId(pl)]
    }

    start(pl: jplayer, abil: IFace<T>){
        let pl_id = GetPlayerId(pl)

        if (TTargeting.__active[pl_id] != undefined || TTargeting.__abil[pl_id] != undefined){
            return Log.err('can not start ability targeting. Another one is active.',
                            __path__, TTargeting, 2)
        }

        TTargeting.__active[pl_id] = this
        TTargeting.__abil[pl_id] = abil

        this.__start_actions.run(this, pl, abil)
    }

    stop(pl: jplayer, abil: IFace<T>){
        let pl_id = GetPlayerId(pl)

        if (TTargeting.__active[pl_id] != this || abil != TTargeting.__abil[pl_id]){
            return Log.err('can not stop inactive ability targeting.',
                            __path__, TTargeting, 2)
        }

        this.__stop_actions.run(this, pl, abil)

        TTargeting.__active[pl_id] = undefined
        TTargeting.__abil[pl_id] = undefined
    }

    finish(pl: jplayer, abil: IFace<T>, target?: T){
        if (pl == GetLocalPlayer()){
            if (!target){
                target = this.__getTarget(abil)
            }
            SYNCER.send(abil, target)
        }
        
        this.stop(pl, abil)
    }

    addAction(event: TTargeting.Event,
              callback: TTargeting.Callback<T>){
        if (event == 'START'){
            this.__start_actions.add(callback)
        } else if (event == 'STOP') {
            this.__stop_actions.add(callback)
        } else {
            return Log.err('unknown event.',
                            __path__, TTargeting, 2)
        }
    }

    private __getTarget: TTargeting.GetLocalTarget<T>
    private __start_actions = new ActionList<[TTargeting<T>, jplayer, IFace<T>]>()
    private __stop_actions = new ActionList<[TTargeting<T>, jplayer, IFace<T>]>()

    private static __active: (TTargeting<any> | undefined)[] = []
    private static __abil: (IFace<TargetType[]> | undefined)[] = []
}

export namespace TTargeting {
    export type Event = 'START' | 'STOP'
    export type GetLocalTarget<T extends TargetType[]> = (this: void, abil: IFace<T>) => T
    export type Callback<T extends TargetType[]> = (this: void, instance: TTargeting<T>, pl: jplayer, abil: IFace<T>) => void
}