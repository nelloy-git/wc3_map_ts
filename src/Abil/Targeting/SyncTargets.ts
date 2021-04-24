import { Vec2 } from '../../Math'
import { hUnit } from '../../Handle'
import { SyncData } from '../../WcIO'

import { Abil, TargetType } from '../Abil'

const DATA_SEP = ';'
const VALUE_SEP = '_'
const VEC2_PREFIX = 'v'
const UNIT_PREFIX = 'u'

type SyncType<T extends TargetType[]> = [Abil<T>, T]

export class SyncTargets extends SyncData<SyncType<any>> {
    
    data2raw(abil: Abil<TargetType[]>, targets: TargetType[]){
        let raw = abil.id.toString()
        for (let i = 0; i < targets.length; i++){
            raw += DATA_SEP + this.__target2raw(targets[i])
        }
        return raw
    }

    raw2data(raw: string): SyncType<any>{
        let list = raw.split(DATA_SEP)

        let abil_id = parseInt(list[0])
        let abil = Abil.get(abil_id)
        if (!abil){
            error(this.toString() + ': invalid ability id.', 2)
        }

        let targets: TargetType[] = []
        for (let i = 1; i < list.length; i++){
            let targ = this.__raw2target(list[i])
            if (!targ){
                error(this.toString() + ': can not parse target[' + i + '] = ' + list[i])
            }

            targets.push(targ)
        }

        return [abil, targets]
    }

    private __target2raw(targ: TargetType){
        let str
        if (targ instanceof hUnit){
            str = UNIT_PREFIX + VALUE_SEP + targ.id.toString()
        } else if (targ instanceof Vec2){
            str = VEC2_PREFIX + VALUE_SEP + targ.toString()
        } else {
            error(this.toString() + ': unknown TargetType.', 3)
        }
    
        return str
    }
    
    private __raw2target(str: string) {
        let [prefix, value] = str.split(VALUE_SEP)
    
        if (prefix == UNIT_PREFIX){
            let handle_id = parseInt(value)
            return hUnit.get(handle_id)
        } else if (prefix == VEC2_PREFIX){
            return Vec2.fromString(value)
        } else {
            error(this.toString() + ': unknown TargetType.', 3)
        }
    }
}