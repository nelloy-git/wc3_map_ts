import { Action } from "./Action";
import { ActionList } from "./ActionList";

export class EventActions<Event, Args extends any[] = []> {
    constructor(err_header?: string){
        this.err_header = err_header
        this.__actions = new Map()
    }

    run(event: Event, ...args: Args){
        let actions = this.__actions.get(event)
        if (actions){
            actions.run(event, ...args)
        }
    }

    add(event: Event,
        action: Action<[Event, ...Args]>)
        : Action<[Event, ...Args]>
    add(event: Event,
        callback: (this: void, event: Event, ...args: Args) => void)
        : Action<[Event, ...Args]>
    add(event: Event,
        actions_or_callback: Action<[Event, ...Args]> |
                            ((this: void, event: Event, ...args: Args) => void))
        : Action<[Event, ...Args]>
    add(event: Event,
        actions_or_callback: Action<[Event, ...Args]> |
                            ((this: void, event: Event, ...args: Args) => void)){

        let actions = this.__actions.get(event)
        if (!actions){
            actions = new ActionList(this.err_header)
            this.__actions.set(event, actions)
        }

        return actions.add(actions_or_callback)
    }

    remove(pos: number, event?: Event): boolean
    remove(action: Action<[Event, ...Args]> | undefined,
           event?: Event)
           : boolean
    remove(action_or_pos: Action<[Event, ...Args]> | number | undefined,
           event?: Event)
           : boolean
    remove(action_or_pos: Action<[Event, ...Args]> | number | undefined,
           event?: Event){

        if (!action_or_pos){
            return false
        }
        
        if (event){
            const actions = this.__actions.get(event)
            if (!actions){
                return false
            }
            return actions.remove(action_or_pos)
        } else {
            for (const [event, list] of this.__actions){
                let removed = list.remove(action_or_pos)
                if (removed){
                    return true
                }
            }
        }
        
        return false
    }

    readonly err_header: string | undefined
    private readonly __actions: Map<Event, ActionList<[Event, ...Args]>>
}