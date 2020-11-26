import { ParamType } from "./Type";
import { ParamValue, ParamValueType } from "./Value";

export class ParamContainer{

    get (param: ParamType, type: ParamValueType){
        return this._values.get(param)?.get(type) as number
    }

    set (param: ParamType, type: ParamValueType, val: number){
        return this._values.get(param)?.set(type, val) as number
    }

    add (param: ParamType, type: ParamValueType, val: number){
        return this._values.get(param)?.add(type, val) as number
    }

    protected _values = new Map<ParamType, ParamValue>([
        [ParamType.PATK, new ParamValue()],
        [ParamType.PSPD, new ParamValue()],
        [ParamType.PDEF, new ParamValue()],
        [ParamType.PRES, new ParamValue()],
        [ParamType.MATK, new ParamValue()],
        [ParamType.MSPD, new ParamValue()],
        [ParamType.MDEF, new ParamValue()],
        [ParamType.MRES, new ParamValue()],
        [ParamType.CRIT, new ParamValue()],
        [ParamType.LIFE, new ParamValue()],
        [ParamType.REGE, new ParamValue()],
        [ParamType.MANA, new ParamValue()],
        [ParamType.RECO, new ParamValue()],
        [ParamType.MOVE, new ParamValue()],
    ])
}