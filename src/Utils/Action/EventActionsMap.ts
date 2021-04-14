import { Action } from "./Action";
import { EventActions } from "./EventActions";

export class EventActionsMap<K, Event, Owner = void, Args extends any[] = []> {
    constructor(owner: Owner,
                err_header?: string){
        this.owner = owner
        this.err_header = err_header
        this.__events = new Map()
    }

    add(key: K,
        event: Event,
        callback: (this: void, owner: Owner, event: Event, ...args: Args) => void){

        let event_actions = this.__events.get(key)
        if (!event_actions){
            event_actions = new EventActions(this.owner, this.err_header)
            this.__events.set(key, event_actions)
        }

        return event_actions.add(event, callback)
    }

    remove(key: K,
           event: Event,
           action: Action<Owner, [Event, ...Args]>){

        let event_actions = this.__events.get(key)
        if (!event_actions){
            return false
        }
        return event_actions.remove(event, action)
    }

    run(key: K,
        event: Event,
        ...args: Args){
            
        let event_actions = this.__events.get(key)
        if (event_actions){
            event_actions.run(event, ...args)
        }
    }

    readonly owner: Owner
    readonly err_header: string | undefined
    private readonly __events: Map<K, EventActions<Event, Owner, Args>>
}