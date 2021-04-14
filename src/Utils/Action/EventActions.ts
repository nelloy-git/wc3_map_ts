import { Action } from "./Action";
import { ActionList } from "./ActionList";

export class EventActions<Event, Owner = void, Args extends any[] = []> {
    constructor(owner: Owner,
                err_header?: string){
        this.owner = owner
        this.err_header = err_header
        this.__actions = new Map()
    }

    add(event: Event,
        callback: (this: void, owner: Owner, event: Event, ...args: Args) => void){

        let actions = this.__actions.get(event)
        if (!actions){
            actions = new ActionList(this.owner, this.err_header)
            this.__actions.set(event, actions)
        }

        return actions.add(callback)
    }

    remove(event: Event,
           action: Action<Owner, [Event, ...Args]>){

        let actions = this.__actions.get(event)
        if (!actions){
            return false
        }
        return actions.remove(action)
    }

    run(event: Event, ...args: Args){
        let actions = this.__actions.get(event)
        if (actions){
            actions.run(event, ...args)
        }
    }

    readonly owner: Owner
    readonly err_header: string | undefined
    private readonly __actions: Map<Event, ActionList<Owner, [Event, ...Args]>>
}