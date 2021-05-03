import { Action } from "./Action";
import { EventActions } from "./EventActions";

export class EventActionsMap<K, Event, Args extends any[] = []> {
    constructor(err_header?: string){
        this.err_header = err_header
        this.__events = new Map()
    }

    add(key: K,
        event: Event,
        action: Action<[Event, ...Args]>)
        : Action<[Event, ...Args]>
    add(key: K,
        event: Event,
        callback: (this: void, event: Event, ...args: Args) => void)
        : Action<[Event, ...Args]>
    add(key: K,
        event: Event,
        actions_or_callback: Action<[Event, ...Args]> |
                            ((this: void, event: Event, ...args: Args) => void))
        : Action<[Event, ...Args]>
    add(key: K,
        event: Event,
        actions_or_callback: Action<[Event, ...Args]> |
                            ((this: void, event: Event, ...args: Args) => void)){

        let event_actions = this.__events.get(key)
        if (!event_actions){
            event_actions = new EventActions(this.err_header)
            this.__events.set(key, event_actions)
        }

        return event_actions.add(event, actions_or_callback)
    }

    remove(key: K,
           action: Action<[Event, ...Args]> | undefined,
           event?: Event){

        let event_actions = this.__events.get(key)
        if (!event_actions){
            return false
        }
        return event_actions.remove(action, event)
    }

    run(key: K,
        event: Event,
        ...args: Args){
            
        let event_actions = this.__events.get(key)
        if (event_actions){
            event_actions.run(event, ...args)
        }
    }

    readonly err_header: string | undefined
    private readonly __events: Map<K, EventActions<Event, Args>>
}