import { Log } from '../../Utils'
import { IFace, TargetType } from '../IFace'
import { SyncTargets } from './SyncTargets'

export abstract class TypeTargeting<T extends TargetType> {
    protected constructor(){}

    static cancelActive(pl: jplayer){
        let cur = TypeTargeting._current[GetPlayerId(pl)]
        if (cur){cur.cancel(pl)}
    }

    static getActiveAbility(pl: jplayer){
        return TypeTargeting._abil[GetPlayerId(pl)]
    }

    static getActiveInstance(pl: jplayer){
        return TypeTargeting._current[GetPlayerId(pl)]
    }

    /* Final function */
    readonly start = (pl: jplayer, abil: IFace) => {
        let pl_id = GetPlayerId(pl)

        TypeTargeting.cancelActive(pl)
        TypeTargeting._current[pl_id] = this
        TypeTargeting._abil[pl_id] = abil

        if (pl == GetLocalPlayer()){
            this._start()
        }
    }

    /* Final function */
    readonly cancel = (pl: jplayer) => {
        let pl_id = GetPlayerId(pl)
        if (TypeTargeting._current[pl_id] != this){
            return Log.err(TypeTargeting.name + 
                           ': can not cancel inactive targeting. ' +
                           'Use static cancelCurrent() instead.', 2)
        }

        if (pl == GetLocalPlayer()){
            this._cancel()
        }

        TypeTargeting._current[pl_id] = undefined
        TypeTargeting._abil[pl_id] = undefined
    }

    /** Final function.
        Use 'targets == Unit[]' to force targets. */
    readonly finish = (pl: jplayer, targets?: T): void => {
        let pl_id = GetPlayerId(pl)
        if (TypeTargeting._current[pl_id] != this){
            return Log.err(TypeTargeting.name + 
                           ': can not finish inactive targeting.', 2)
        }
        let abil = TypeTargeting.getActiveAbility(pl)
        if (!abil){
            return Log.err(TypeTargeting.name + 
                           ': current ability for player has not been set.', 2)
        }

        /* Sync targets from local player. */
        if (pl == GetLocalPlayer()){
            let abil_targets = this._finish(targets)
            if (abil_targets){
                TypeTargeting._syncer?.send(abil, abil_targets)
            }
        }

        TypeTargeting._current[pl_id] = undefined
        TypeTargeting._abil[pl_id] = undefined
    }

    protected abstract _start(): void
    protected abstract _cancel(): void
    /** 'targets = undefined' should capture targets by itself. */
    protected abstract _finish(targets?: T): T | undefined

    private static _current: (TypeTargeting<any> | undefined)[] = [];
    private static _abil: (IFace | undefined)[] = [];

    private static _syncer = IsGame() ? (():SyncTargets => {
        let sync = new SyncTargets()
        sync.addAction((pl: jplayer, abil: IFace, targets: TargetType) => {
            abil.castingStart(targets)
        })
        return sync
    })() : undefined;
}