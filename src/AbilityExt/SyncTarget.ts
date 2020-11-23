import { Action, ActionList, Log } from '../Utils/index'
import { SyncData } from '../Input/index'
import { Unit } from '../Handle/index'

import { Point } from './Point'
import { AbilityTargets } from './Ability/Iface'

type SyncTargetData = [number, AbilityTargets]

export class SyncTarget extends SyncData<SyncTargetData> {
    constructor(){
        super()
    }

    protected data2raw(abil_id: number, targets: AbilityTargets){
        let raw = abil_id.toString()

        for (let targ of targets){
             if (targ instanceof Unit){
                raw += SyncTarget._sep + 
                       SyncTarget._prefUnit + SyncTarget._prefSep + 
                       targ.id.toString()
            } else if (targ instanceof Point){
                raw += SyncTarget._sep + 
                       SyncTarget._prefPoint +SyncTarget._prefSep +
                       targ.toString()
             }
        }

        return raw
    }

    protected raw2data(raw: string): SyncTargetData{
        let vals = raw.split(SyncTarget._sep)

        let abil_id = parseInt(vals[0])
        let targets: AbilityTargets = []
        for (let i = 1; i < vals.length; i++){
            let targ
            let [pref, val] = vals[i].split(SyncTarget._prefSep)
            if (pref == SyncTarget._prefUnit){
                targ = Unit.get(parseInt(val))
            } else if (pref == SyncTarget._prefPoint){
                targ = new Point(val)
            }
            
            if (typeof targ === 'undefined'){ 
               return Log.err(SyncTarget.toString() + 
                              ': can not parse targets.')
            }

            targets.push(targ)
        }

        return [abil_id, targets]
    }

    private static readonly _sep = ';'
    private static readonly _prefSep = '_'
    private static readonly _prefPoint = 'p'
    private static readonly _prefUnit = 'u'
}