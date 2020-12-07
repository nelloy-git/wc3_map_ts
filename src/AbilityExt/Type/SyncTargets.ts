import { Action, ActionList, Log } from '../../Utils/index'
import { SyncData } from '../../Input/index'
import { hUnit } from '../../Handle/index'

import { Point } from '../Point'
import { AbilityBase } from '../Ability/Base'

export class SyncTargets<TargType extends AbilityBase.TargType> 
                extends SyncData<[AbilityBase<TargType>, TargType]> {
    
    protected data2raw(abil: AbilityBase<TargType>,
                       target: TargType){

        let raw = abil.id.toString()

        if (target instanceof Array){
            for (let targ of target){
                raw += SyncTargets._sep + 
                       this._toRaw(targ)
            }
        } else {
            raw += SyncTargets._sep + 
                   this._toRaw(target)
        }

        return raw
    }

    protected raw2data(raw: string): [AbilityBase<TargType>, TargType]{
        let vals = raw.split(SyncTargets._sep)

        let abil_id = parseInt(vals[0])
        let targets: AbilityBase.TargType = []
        for (let i = 1; i < vals.length; i++){
            let targ
            let [pref, val] = vals[i].split(SyncTargets._prefSep)
            if (pref == SyncTargets._prefUnit){
                targ = hUnit.get(parseInt(val))
            } else if (pref == SyncTargets._prefPoint){
                targ = new Point(val)
            }
            
            if (typeof targ === 'undefined'){ 
               return Log.err(SyncTargets.toString() + 
                              ': can not parse targets.')
            }

            targets.push(targ)
        }

        if (targets.length == 1){targets = targets[0]}

        let abil = AbilityBase.get(abil_id)
        if (!abil){
            return Log.err(SyncTargets.name + 
                           ': got invalid ability id.')
        }

        return [abil, targets]
    }

    /* Can not be used with arrays. */
    private _toRaw(obj: TargType){
        let raw
        if (obj instanceof hUnit){
            raw = SyncTargets._prefUnit + SyncTargets._prefSep + 
                  obj.id.toString()
        } else if (obj instanceof Point){
            raw = SyncTargets._prefPoint +SyncTargets._prefSep +
                  obj.toString()
        } else {
            return Log.err(SyncTargets.name + 
                        ': unknown target type.')
        }
        return raw
    }

    private static readonly _sep = ';'
    private static readonly _prefSep = '_'
    private static readonly _prefPoint = 'p'
    private static readonly _prefUnit = 'u'
}