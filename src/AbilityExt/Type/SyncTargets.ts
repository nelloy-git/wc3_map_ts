import * as H from '../../Handle'
import * as U from '../../Utils'
import * as Input from '../../WcIO'

import { IFace } from '../Ability/IFace'
import { TargetType } from '../Utils'
import { Point } from '../Point'

export class SyncTargets extends Input.SyncData<[IFace<TargetType>, TargetType]> {
    
    protected data2raw(abil: IFace<TargetType>,
                       target: TargetType){

        let raw = abil.Data.id.toString()
        for (let targ of target){
            raw += SyncTargets._sep + 
                   this._toRaw(targ)
        }
        return raw
    }

    protected raw2data(raw: string): [IFace<TargetType>, TargetType]{
        let vals = raw.split(SyncTargets._sep)

        let abil_id = parseInt(vals[0])
        let target: TargetType = []
        for (let i = 1; i < vals.length; i++){
            target.push(this._fromRaw(vals[i]))
        }

        let abil = IFace.get(abil_id)
        if (!abil){
            return U.Log.err(SyncTargets.name + 
                           ': got invalid ability id.')
        }

        return [abil, target]
    }

    /* Can not be used with arrays. */
    private _toRaw(obj: H.hUnit | Point){
        let raw
        if (obj instanceof H.hUnit){
            raw = SyncTargets._prefUnit + SyncTargets._prefSep + 
                  obj.id.toString()
        } else if (obj instanceof Point){
            raw = SyncTargets._prefPoint +SyncTargets._prefSep +
                  obj.toString()
        } else {
            return U.Log.err(SyncTargets.name + 
                           ': unknown target type.')
        }
        return raw
    }

    private _fromRaw(raw: string){
        let targ
        let [pref, val] = raw.split(SyncTargets._prefSep)
        if (pref == SyncTargets._prefUnit){
            targ = H.hUnit.get(parseInt(val))
        } else if (pref == SyncTargets._prefPoint){
            targ = new Point(val)
        } else { 
            return U.Log.err(SyncTargets.toString() + 
                           ': unknown target type.')
        }

        if (!targ){
            return U.Log.err(SyncTargets.toString() + 
                           ': can not parse targets.')
        }

        return targ
    }

    private static readonly _sep = ';'
    private static readonly _prefSep = '_'
    private static readonly _prefPoint = 'p'
    private static readonly _prefUnit = 'u'
}