import { Parameter } from "./Parameter";
import { ParamValue, ParamValueType } from "./Value";

export class ParamContainer{

    get(param: Parameter.Type, type: ParamValueType){
        return this._values.get(param)?.get(type) as number
    }

    set(param: Parameter.Type, type: ParamValueType, val: number){
        return this._values.get(param)?.set(type, val) as number
    }

    add(param: Parameter.Type, type: ParamValueType, val: number){
        return this._values.get(param)?.add(type, val) as number
    }

    protected _values = new Map<Parameter.Type, ParamValue>([
        ['PATK', new ParamValue()],
        ['PSPD', new ParamValue()],
        ['PDEF', new ParamValue()],
        ['PRES', new ParamValue()],
        ['MATK', new ParamValue()],
        ['MSPD', new ParamValue()],
        ['MDEF', new ParamValue()],
        ['MRES', new ParamValue()],
        ['CRIT', new ParamValue()],
        ['LIFE', new ParamValue()],
        ['REGE', new ParamValue()],
        ['MANA', new ParamValue()],
        ['RECO', new ParamValue()],
        ['MOVE', new ParamValue()],
    ])
}