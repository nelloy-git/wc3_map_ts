import { Action, ActionList, Log } from "../Utils";
import { Type } from "./Type";
import { Value, ValueType } from "./Value";

export class Container{

    get(param: Type, type: ValueType){
        let val = this._values.get(param)?.get(type)
        if (!val){
            return Log.err(Container.name + 
                           ': can not get \"' + param + '\" parameter.')
        }

        val = val < Type.min(param) ? Type.min(param)
                                    : val > Type.max(param) ? Type.max(param)
                                                            : val
        return val
    }

    set(param: Type, type: ValueType, val: number){
        let res =  this._values.get(param)?.set(type, val)
        if (!res){
            return Log.err(Container.name + 
                           ': can not get \"' + param + '\" parameter.')
        }
        res = res < Type.min(param) ? Type.min(param)
                                    : res > Type.max(param) ? Type.max(param)
                                                            : res
        this._actions.run(this, param)
        return res
    }

    add(param: Type, type: ValueType, val: number){
        let res =  this._values.get(param)?.add(type, val)
        if (!res){
            return Log.err(Container.name + 
                           ': can not get \"' + param + '\" parameter.')
        }
        res = res < Type.min(param) ? Type.min(param)
                                    : res > Type.max(param) ? Type.max(param)
                                                            : res
        this._actions.run(this, param)
        return res
    }

    addAction(callback: (this: void,
                         cont: Container,
                         param: Type)=>void){
        return this._actions.add(callback)
    }

    removeAction(action: Action<[Container, Type], void> | undefined){
        return this._actions.remove(action)
    }

    private _actions = new ActionList<[Container, Type]>()
    private _values = new Map<Type, Value>([
        ['PATK', new Value()],
        ['PSPD', new Value()],
        ['PDEF', new Value()],
        ['PRES', new Value()],
        ['MATK', new Value()],
        ['MSPD', new Value()],
        ['MDEF', new Value()],
        ['MRES', new Value()],
        ['CRIT', new Value()],
        ['LIFE', new Value()],
        ['REGE', new Value()],
        ['MANA', new Value()],
        ['RECO', new Value()],
        ['MOVE', new Value()],
    ])
}