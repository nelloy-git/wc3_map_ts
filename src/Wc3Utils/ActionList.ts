/** @noSelfInFile */

import {Action} from './Action'

export class ActionList<In extends any[]> {
    constructor(){}

    public run(...args: In){
        for (let i = 0; i < this._actions.length; i++){
            this._actions[i].run(...args)
        }
    }

    public add(callback: (...args: In)=>void){
        let action = new Action<In, void>(callback)
        this._actions.push(action)
        return action
    }

    public remove(action: Action<In, void> | undefined){
        if (!action){return false}

        let pos = this._actions.indexOf(action)
        if (pos < 0){return false}
        this._actions.slice(pos, 1)
        return true
    }

    private _actions: Action<In, void>[] = [];
}