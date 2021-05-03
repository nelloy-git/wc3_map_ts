import { Action } from "./Action";
import { ActionList } from "./ActionList";
import { log } from '../Log'

export class EventActions<Event, Args extends any[] = []> {
    constructor(header?: string){
        this.header = header
        this.__actions = new Map()
        // this.__mapped = new Map()
        this.__senders = new Map()
        this.__links = new Map()
    }

    toString(){
        return this.header + '.' + this.constructor.name
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
        callback: Callback<Event, Args>)
        : Action<[Event, ...Args]>
    add(event: Event,
        actions_or_callback: Action<[Event, ...Args]> |
                            (Callback<Event, Args>))
        : Action<[Event, ...Args]>
    add(event: Event,
        actions_or_callback: Action<[Event, ...Args]> |
                            (Callback<Event, Args>)){

        let actions = this.__actions.get(event)
        if (!actions){
            actions = new ActionList(this.header)
            this.__actions.set(event, actions)
        }

        return actions.add(actions_or_callback)
    }
    
    remove(action: Action<[Event, ...Args]> | undefined,
           event?: Event){

        if (!action){
            return false
        }
        
        if (event){
            const actions = this.__actions.get(event)
            if (!actions){
                return false
            }
            return actions.remove(action)
        } else {
            for (const [event, list] of this.__actions){
                let removed = list.remove(action)
                if (removed){
                    return true
                }
            }
        }
        
        return false
    }

    link<ReceiverEvent>(
        events: ReadonlyMap<Event, ReceiverEvent>,
        receiver: EventActions<ReceiverEvent, Args>,
        convert?: Convert<Event, Args, Args>): void

    link<ReceiverEvent, ReceiverArgs extends any[]>(
        events: ReadonlyMap<Event, ReceiverEvent>,
        receiver: EventActions<ReceiverEvent, ReceiverArgs>,
        convert: Convert<Event, Args, ReceiverArgs>): void

    link<ReceiverEvent, ReceiverArgs extends any[]>(
        events: ReadonlyMap<Event, ReceiverEvent>,
        receiver: EventActions<ReceiverEvent, ReceiverArgs>,
        convert: Convert<Event, Args, ReceiverArgs> =
            (e, args) => {return <ReceiverArgs><unknown>args}){

        // Register receiver for this instance
        let list = this.__links.get(receiver)
        if (!list){
            list = []
            this.__links.set(receiver, list)
        }

        // Register this as sender
        receiver.__senders.set(this, true)
        
        // Creates actions for sending events
        for (const [event, receiver_event] of events){
            const act = this.add(event, (e, ...args) => {receiver.run(receiver_event, ...convert(e, args))})
            list.push(act)
        }
    }

    unlink(receiver: EventActions<any, any>){
        let list = this.__links.get(receiver)
        if (!list){
            return false
        }
        this.__links.delete(receiver)

        receiver.__senders.delete(this)

        let removed = true
        for (const act of list){
            removed = removed && this.remove(act)
        }

        return removed
    }

    islinked(provider: EventActions<any, any>){
        return this.__links.get(provider) != undefined
    }

    readonly header: string | undefined
    
    private __senders: Map<Sender, boolean>
    private __links: Map<Receiver, Action<any, void>[]>
    private __actions: Map<Event, ActionList<[Event, ...Args]>>

}

type Convert<E, In, Out> = (event: E, args: In) => Out
type Callback<E, In extends any[]> = (this: void, event: E, ...args: In) => void
type Receiver = EventActions<any, any>
type Sender = EventActions<any, any>