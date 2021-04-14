import * as Handle from '../../../src/Handle'
import * as Utils from '../../../src/Utils'
import * as Input from '../../WcIO'

import { IFace, TargetType } from '../Ability/IFace'

const __path__ = Macro(Utils.getFilePath())

const DATA_SEP = ';'
const VALUE_SEP = '_'
const VEC2_PREFIX = 'v'
const UNIT_PREFIX = 'u'

function __toString(obj: TargetType): string | undefined{
    let str
    if (obj instanceof Handle.hUnit){
        str = UNIT_PREFIX + VALUE_SEP + obj.id.toString()
    } else if (obj instanceof Utils.Vec2){
        str = VEC2_PREFIX + VALUE_SEP + obj.toString()
    } 

    return str
}

function __fromString(str: string): TargetType | undefined{
    let targ: TargetType | undefined
    let [prefix, value] = str.split(VALUE_SEP)

    if (prefix == UNIT_PREFIX){
        let handle_id = parseInt(value)
        targ = Handle.hUnit.get(handle_id)
    } else if (prefix == VEC2_PREFIX){
        targ = Utils.Vec2.fromString(value)
    }

    return targ
}

type SyncType = [IFace<TargetType[]>, TargetType[]]

export class SyncTargets extends Input.SyncData<SyncType> {
    
    protected data2raw(abil: IFace<TargetType[]>,
                       targets: TargetType[]){

        let raw = abil.Data.id.toString()
        for (let i = 0; i < targets.length; i++){
            let s = __toString(targets[i])
            if (!s){
                return Utils.Log.err('unknown TargetType. targets[' + i + ']',
                                        __path__, SyncTargets, 2)
            }
            raw += DATA_SEP + s
        }
        return raw
    }

    protected raw2data(raw: string): SyncType{
        let list = raw.split(DATA_SEP)

        let abil_id = parseInt(list[0])
        let abil = IFace.get(abil_id)
        if (!abil){
            return Utils.Log.err('invalid ability id.',
                                    __path__, SyncTargets, 2)
        }

        let targets: TargetType[] = []
        for (let i = 1; i < list.length; i++){
            let targ = __fromString(list[i])

            if (!targ){
                return Utils.Log.err('can not parse target[' + i + '] = ' + list[i])
            }

            targets.push(targ)
        }

        return [abil, targets]
    }
}