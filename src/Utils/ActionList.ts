/** @noSelfInFile */

import {Action} from './Action'

export class ActionList<In extends any[]> {
    constructor(){
        this.__actions = []
    }

    get length(){
        return this.__actions.length
    }

    run(...args: In){
        for (let i = 0; i < this.__actions.length; i++){
            this.__actions[i].run(...args)
        }
    }

    add(callback: (...args: In) => void){
        let action = new Action<In, void>(callback)
        this.__actions.push(action)
        return action
    }

    remove(action: Action<In, void> | undefined){
        if (!action){return false}

        let pos = this.__actions.indexOf(action)
        if (pos < 0){return false}
        this.__actions.splice(pos, 1)
        return true
    }

    private __actions: Action<In, void>[]
}