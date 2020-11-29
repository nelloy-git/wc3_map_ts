import { Action, Log } from '../../Utils'
import { AbilityBase, AbilityTargets } from '../Ability/Base'
import { SyncTargets } from './SyncTargets'

export abstract class Targeting {
    public static cancelCurrent(pl: jplayer){
        if (Targeting._current){Targeting._current.cancel(pl)}
        Targeting._current = undefined
    }

    public static isActive(pl: jplayer){
        return Targeting._is_player_targeting[GetPlayerId(pl)]
    }

    /* Final function */
    public readonly start = (pl: jplayer,
                             abil: AbilityBase) => {
        if (pl == GetLocalPlayer()){
            Targeting._is_player_targeting[GetPlayerId(pl)] = true
        } else {                       
            Targeting.cancelCurrent(pl)
            Targeting._is_player_targeting[GetPlayerId(pl)] = true
            Targeting._current = this
            Targeting._abil = abil
            
            this._start()
        }
    }

    /* Final function */
    public readonly cancel = (pl: jplayer): void => {
        if (Targeting._current != this){
            Log.err(Targeting.name + 
                    ': can not cancel inactive targeting. ' +
                    'Use static cancelCurrent() instead.', 2)
        }
        Targeting._is_player_targeting[GetPlayerId(pl)] = false
        Targeting._current = undefined
        this._cancel()
    }

    /** Final function.
        Use 'targets == Unit[]' to force targets. */
    public readonly finish = (pl: jplayer, targets?: AbilityTargets): void => {
        if (Targeting._current != this){
            Log.err(Targeting.name + 
                    ': can not finish inactive targeting.', 2)
        }
        if (!Targeting._abil){return}

        Targeting._is_player_targeting[GetPlayerId(pl)] = false
        Targeting._current = undefined

        targets = this._finish(targets)
    }

    protected abstract _start(): void
    protected abstract _cancel(): void
    /** 'targets = undefined' should capture targets by itself. */
    protected abstract _finish(targets?: AbilityTargets): AbilityTargets

    private static _syncer = IsGame() ? (():SyncTargets => {
        let sync = new SyncTargets()
        sync.addAction(Targeting._receiveTargets)
        return sync
    })() : undefined;

    private static _sendTargets(targets: AbilityTargets){
        Targeting._syncer?.send(Targeting._abil, targets)
    }

    private static _receiveTargets(this: void, pl: jplayer,
                                   abil_id: number, targets: AbilityTargets){
        let abil = AbilityBase.get(abil_id)
        if (!abil){return Log.err('TODO')}
        abil.castingStart(targets)
    }

    protected static get current(){return Targeting._current}
    protected static get ability(){return Targeting._abil}

    private static _is_player_targeting: boolean[];
    private static _current: Targeting | undefined;
    private static _abil: AbilityBase;
    private static _action: Action<[AbilityBase, AbilityTargets], void>;
}