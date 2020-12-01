import { Log } from '../../Utils'
import { AbilityBase, Targets } from '../Ability/Base'
import { SyncTargets } from './SyncTargets'

export abstract class Targeting {
    static cancelActive(pl: jplayer){
        let cur = Targeting._current[GetPlayerId(pl)]
        if (cur){cur.cancel(pl)}
    }

    static getActiveAbility(pl: jplayer){
        return Targeting._abil[GetPlayerId(pl)]
    }

    static getActiveInstance(pl: jplayer){
        return Targeting._current[GetPlayerId(pl)]
    }

    /* Final function */
    readonly start = (pl: jplayer, abil: AbilityBase) => {
        let pl_id = GetPlayerId(pl)

        Targeting.cancelActive(pl)
        Targeting._current[pl_id] = this
        Targeting._abil[pl_id] = abil

        if (pl == GetLocalPlayer()){
            this._start()
        }
    }

    /* Final function */
    readonly cancel = (pl: jplayer) => {
        let pl_id = GetPlayerId(pl)
        if (Targeting._current[pl_id] != this){
            return Log.err(Targeting.name + 
                           ': can not cancel inactive targeting. ' +
                           'Use static cancelCurrent() instead.', 2)
        }

        if (pl == GetLocalPlayer()){
            this._cancel()
        }

        Targeting._current[pl_id] = undefined
        Targeting._abil[pl_id] = undefined
    }

    /** Final function.
        Use 'targets == Unit[]' to force targets. */
    readonly finish = (pl: jplayer, targets?: Targets): void => {
        let pl_id = GetPlayerId(pl)
        if (Targeting._current[pl_id] != this){
            return Log.err(Targeting.name + 
                           ': can not finish inactive targeting.', 2)
        }
        let abil = Targeting._abil[pl_id]
        if (!abil){
            return Log.err(Targeting.name + 
                           ': current ability for player has not been set.', 2)
        }

        /* Sync targets from local player. */
        if (pl == GetLocalPlayer()){
            Targeting._syncer?.send(abil, this._finish(targets))
        }

        Targeting._current[pl_id] = undefined
        Targeting._abil[pl_id] = undefined
    }

    protected abstract _start(): void
    protected abstract _cancel(): void
    /** 'targets = undefined' should capture targets by itself. */
    protected abstract _finish(targets?: Targets): Targets

    private static _current: (Targeting | undefined)[] = [];
    private static _abil: (AbilityBase | undefined)[] = [];

    private static _syncer = IsGame() ? (():SyncTargets => {
        let sync = new SyncTargets()
        sync.addAction((pl: jplayer, abil: AbilityBase, targets: Targets) => {
            abil.castingStart(targets)
        })
        return sync
    })() : undefined;
}