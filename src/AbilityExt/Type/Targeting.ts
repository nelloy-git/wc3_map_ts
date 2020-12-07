import { Log } from '../../Utils'
import { AbilityIFace, TargetType } from '../Ability/IFace'
import { SyncTargets } from './SyncTargets'

export abstract class Targeting<T extends TargetType> {

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
    readonly start = (pl: jplayer, abil: AbilityIFace) => {
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
    readonly finish = (pl: jplayer, targets?: T): void => {
        let pl_id = GetPlayerId(pl)
        if (Targeting._current[pl_id] != this){
            return Log.err(Targeting.name + 
                           ': can not finish inactive targeting.', 2)
        }
        let abil = Targeting.getActiveAbility(pl)
        if (!abil){
            return Log.err(Targeting.name + 
                           ': current ability for player has not been set.', 2)
        }

        /* Sync targets from local player. */
        if (pl == GetLocalPlayer()){
            let abil_targets = this._finish(targets)
            if (abil_targets){
                Targeting._syncer?.send(abil, abil_targets)
            }
        }

        Targeting._current[pl_id] = undefined
        Targeting._abil[pl_id] = undefined
    }

    protected abstract _start(): void
    protected abstract _cancel(): void
    /** 'targets = undefined' should capture targets by itself. */
    protected abstract _finish(targets?: T): T | undefined

    private static _current: (Targeting<any> | undefined)[] = [];
    private static _abil: (AbilityIFace | undefined)[] = [];

    private static _syncer = IsGame() ? (():SyncTargets => {
        let sync = new SyncTargets()
        sync.addAction((pl: jplayer, abil: AbilityIFace, targets: TargetType) => {
            abil.castingStart(targets)
        })
        return sync
    })() : undefined;
}