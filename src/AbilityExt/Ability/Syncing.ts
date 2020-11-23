import { Log } from '../../Utils'
import { AbilityBase } from './Base'
import { SyncTarget } from '../SyncTarget'
import { AbilityIface, AbilityTargets } from './Iface'

export abstract class AbilitySyncing extends AbilityBase {
    protected abstract _receivedTargets(targets: AbilityTargets): void;
    protected static _sendTargets(this: void, abil: AbilityIface, targets: AbilityTargets){
        AbilitySyncing._syncer?.send(abil.id, targets)
    }

    private static _recTargets(this: void, pl: jplayer, abil_id: number, targets: AbilityTargets){
        let abil = AbilityBase.get(abil_id) 
        if (!abil){return Log.err('')}
        (abil as AbilitySyncing)._receivedTargets(targets)
    }
    
    private static _syncer = IsGame() ? (():SyncTarget=>{
        let sync = new SyncTarget()
        sync.addAction(AbilitySyncing._recTargets)
        return sync
    })() : undefined;
}