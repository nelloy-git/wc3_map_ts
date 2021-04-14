import { Action } from './Action'

export class ActionList<Owner = void, Args extends any[] = []> {
    constructor(owner: Owner,
                err_header?: string){
        this.owner = owner
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

    add(callback: (this: void, owner: Owner, ...args: Args) => void){
        let action = new Action<Owner, Args>(this.owner, callback, this.err_header)
        this.__actions.push(action)
        return action
    }

    remove(action: Action<Owner, Args> | undefined){
        if (!action){return false}

        let pos = this.__actions.indexOf(action)
        if (pos < 0){return false}
        this.__actions.splice(pos, 1)
        return true
    }

    readonly owner: Owner
    readonly err_header: string | undefined
    private __actions: Action<Owner, Args>[]
}