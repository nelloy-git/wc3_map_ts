import { Action } from "./Action";
import { ActionList } from "./ActionList";

type DefaultConvert<T> = (args: T) => T

export class EventActions<Event, Args extends any[] = []> {
    constructor(err_header?: string){
        this.err_header = err_header
        this.__actions = new Map()
        this.__mapped = new Map()
        this.__linked = new Map()
    }

    toString(){
        return this.err_header + '.' + this.constructor.name
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

    //** To update actions use removeMap first. */
    addMap(map: Map<Event, (this: void, event: Event, ...args: Args) => void>){
        if (this.__mapped.get(map)){
            error(this.toString() + ': can not add mapped actions. This map is already added.')
        }

        const list: Action<[Event, ...Args]>[] = []
        for (const [event, callback] of map){
            const act = this.add(event, callback)
            list.push(act)
        }
        this.__mapped.set(map, list)
    }

    removeMap(map: Map<Event, (this: void, event: Event, ...args: Args) => void>){
        const list = this.__mapped.get(map)
        if (!list){
            return false
        }

        let removed = true
        for (const act of list){
            removed = removed && this.remove(act)
        }
        this.__mapped.delete(map)

        return removed
    }

    link<ProviderEvent>(
        events: ReadonlyMap<ProviderEvent, Event>,
        provider: EventActions<ProviderEvent, Args>,
        convert?: (event: ProviderEvent, args: Args) => Args): void

    link<ProviderEvent, ProviderArgs extends any[]>(
        events: ReadonlyMap<ProviderEvent, Event>,
        provider: EventActions<ProviderEvent, ProviderArgs>,
        convert: (event: ProviderEvent, args: ProviderArgs) => Args): void

    link<ProviderEvent, ProviderArgs extends any[]>(
        events: ReadonlyMap<ProviderEvent, Event>,
        provider: EventActions<ProviderEvent, ProviderArgs>,
        convert: (event: ProviderEvent, args: ProviderArgs) => Args = (event, args) => {return <Args><unknown>args},
        append: boolean = false){

        let list = this.__linked.get(provider)
        if (!append && list){
            error(this.toString() + ': can not link actions. Already linked.')
        }

        list = list ? list : []
        for (const [linked_event, this_event] of events){
            const act = provider.add(linked_event, (e, ...args) => {this.run(this_event, ...convert(e, args))})
            list.push(act)
        }

        this.__linked.set(provider, list)
    }

    unlink<LinkedEvent, LinkedArgs extends any[]>(provider: EventActions<LinkedEvent, LinkedArgs>){
        const list = this.__linked.get(provider)
        if (!list){
            return false
        }

        let removed = true
        for (const act of list){
            removed = removed && provider.remove(act)
        }
        this.__linked.delete(provider)

        return removed
    }

    readonly err_header: string | undefined
    
    private readonly __actions: Map<Event, ActionList<[Event, ...Args]>>
    private readonly __mapped: Map<Map<Event, (this: void, event: Event, ...args: Args) => void>, Action<[Event, ...Args]>[]>
    private readonly __linked: Map<EventActions<any, any>, Action<any, void>[]>
}