import { Action } from './Action'

export class ActionList<Args extends any[] = []> {
    constructor(err_header?: string){
        this.err_header = err_header
        this.__actions = []
    }

    get length(){
        return this.__actions.length
    }

    run(...args: Args){
        for (let i = 0; i < this.__actions.length; i++){
            this.__actions[i].run(...args)
        }
    }

    add(action: Action<Args>): Action<Args>
    add(callback: (this: void, ...args: Args) => void): Action<Args>
    add(action_or_callback: Action<Args> | ((this: void, ...args: Args) => void)): Action<Args>
    add(action_or_callback: Action<Args> | ((this: void, ...args: Args) => void)){
        let action: Action<Args>
        if (typeof action_or_callback === 'function'){
            action = new Action<Args>(action_or_callback, this.err_header)
        } else {
            action = action_or_callback
        }
        this.__actions.push(action)
        return action
    }

    remove(pos: number): boolean
    remove(action: Action<Args> | undefined): boolean
    remove(action_or_pos: Action<Args> | number | undefined): boolean
    remove(action_or_pos: Action<Args> | number | undefined){
        if (!action_or_pos){
            return false
        }

        let pos: number
        if (typeof action_or_pos === 'number'){
            pos = action_or_pos
        } else {
            pos = this.__actions.indexOf(action_or_pos)
        }

        if (pos >= 0){
            this.__actions.splice(pos, 1)
        }
        return pos >= 0
    }

    readonly err_header: string | undefined
    private __actions: Action<Args>[]
}