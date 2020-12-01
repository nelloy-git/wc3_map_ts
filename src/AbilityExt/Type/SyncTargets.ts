import { Action, ActionList, Log } from '../../Utils/index'
import { SyncData } from '../../Input/index'
import { Unit } from '../../Handle/index'

import { Point } from '../Point'
import { AbilityBase, Targets } from '../Ability/Base'

type SyncTargetData = [AbilityBase, Targets]

export class SyncTargets extends SyncData<SyncTargetData> {
    constructor(){
        super()
    }

    protected data2raw(abil: AbilityBase, targets: Targets){
        let raw = abil.id.toString()

        for (let targ of targets){
             if (targ instanceof Unit){
                raw += SyncTargets._sep + 
                       SyncTargets._prefUnit + SyncTargets._prefSep + 
                       targ.id.toString()
            } else if (targ instanceof Point){
                raw += SyncTargets._sep + 
                       SyncTargets._prefPoint +SyncTargets._prefSep +
                       targ.toString()
            }
        }

        return raw
    }

    protected raw2data(raw: string): SyncTargetData{
        let vals = raw.split(SyncTargets._sep)

        let abil_id = parseInt(vals[0])
        let targets: Targets = []
        for (let i = 1; i < vals.length; i++){
            let targ
            let [pref, val] = vals[i].split(SyncTargets._prefSep)
            if (pref == SyncTargets._prefUnit){
                targ = Unit.get(parseInt(val))
            } else if (pref == SyncTargets._prefPoint){
                targ = new Point(val)
            }
            
            if (typeof targ === 'undefined'){ 
               return Log.err(SyncTargets.toString() + 
                              ': can not parse targets.')
            }

            targets.push(targ)
        }

        let abil = AbilityBase.get(abil_id)
        if (!abil){
            return Log.err(SyncTargets.name + 
                           ': got invalid ability id.')
        }

        return [abil, targets]
    }

    private static readonly _sep = ';'
    private static readonly _prefSep = '_'
    private static readonly _prefPoint = 'p'
    private static readonly _prefUnit = 'u'
}