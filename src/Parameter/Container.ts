import { Action, ActionList } from "../Utils";
import { Parameter } from "./Parameter";
import { ParamValue, ParamValueType } from "./Value";

export class ParamContainer{

    get(param: Parameter.Type, type: ParamValueType){
        return this._values.get(param)?.get(type) as number
    }

    set(param: Parameter.Type, type: ParamValueType, val: number){
        let res =  this._values.get(param)?.set(type, val) as number
        this._actions.run(this, param)
        return res
    }

    add(param: Parameter.Type, type: ParamValueType, val: number){
        let res =  this._values.get(param)?.add(type, val) as number
        this._actions.run(this, param)
        return res
    }

    addAction(callback: (this: void,
                         cont: ParamContainer,
                         param: Parameter.Type)=>void){
        return this._actions.add(callback)
    }

    removeAction(action: Action<[ParamContainer, Parameter.Type], void> | undefined){
        return this._actions.remove(action)
    }

    private _actions = new ActionList<[ParamContainer, Parameter.Type]>()
    private _values = new Map<Parameter.Type, ParamValue>([
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