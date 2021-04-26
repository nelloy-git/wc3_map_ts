import { Action, EventActions, log } from "../Utils";
import { hUnit } from "../Handle";

import { Abil, TargetType } from './Abil'
import { TAbil } from './TAbil'

export class AbilContainer {
    constructor(owner: hUnit){
        this.owner = owner
        this.actions = new EventActions(this.toString())

        this.__list = new Map()
        this.__list_actions = new Map()

        if (AbilContainer.__owner2container.get(owner)){
            error(AbilContainer.name + ': ability container for ' + owner.toString() + ' already exists.', 2)
        }
        AbilContainer.__owner2container.set(owner, this)
    }

    static get(owner: hUnit | undefined){
        if (!owner){
            return undefined
        }
        return AbilContainer.__owner2container.get(owner)
    }

    toString(){
        return this.owner.toString() + '.' + this.constructor.name
    }

    get list(): ReadonlyMap<number, Abil<TargetType[]>>{
        return this.__list
    }

    set(pos: number, type: TAbil<any> | undefined){
        let prev = this.__list.get(pos)
        if (prev){
            this.__list.delete(pos)
            this.__runActions('REMOVED', prev, pos)
            this.__unlinkActions(prev, pos)
            prev.destroy()
        }

        if (type){
            let abil = new Abil<any>(this.owner, type)
            this.__list.set(pos, abil)
            this.__linkActions(abil, pos)
            this.__runActions('ADDED', abil, pos)
        }
    }

    get(i: number): Readonly<Abil<TargetType[]>> | undefined{
        return this.__list.get(i)
    }

    destroy(){
        for (const [pos, abil] of this.__list){
            this.__unlinkActions(abil, pos)
            abil.destroy()
        }
        AbilContainer.__owner2container.delete(this.owner)
    }

    private __runActions(event: AbilContainer.Event, abil: Abil<any>, pos: number){
        AbilContainer.actions.run(event, this, abil, pos)
        this.actions.run(event, this, abil, pos)
    }

    private __linkActions(abil: Abil<any>, pos: number){
        if (this.__list_actions.get(pos)){
            log(this.toString() + ': previous linked action list is not empty.', 'Wrn')
        }

        let list: Action<[Abil.Event, Abil<any>]>[] = []
        this.__list_actions.set(pos, list)

        for (const event of AbilContainer.__linked_events){
            let act = abil.actions.add(event, () => {this.__runActions(event, abil, pos)})
            list.push(act)
        }
    }

    private __unlinkActions(abil: Abil<any>, pos: number){
        const list = this.__list_actions.get(pos)
        this.__list_actions.delete(pos)
        if (!list){
            log(this.toString() + ': linked action list is empty.', 'Wrn')
            return
        }

        for (const act of list){
            let removed = abil.actions.remove(act)
            if (!removed){
                log(this.toString() + ': can not remove linked action', 'Wrn')
            }
        }
    }

    readonly owner: hUnit;
    readonly actions: EventActions<AbilContainer.Event, [inst: AbilContainer, abil: Abil<any> | undefined, pos: number]>

    private __list: Map<number, Abil<TargetType[]>>
    private __list_actions: Map<number, Action<[Abil.Event, Abil<any>]>[]>

    private static __owner2container = new Map<hUnit, AbilContainer>()
    private static __linked_events: Exclude<AbilContainer.Event, 'ADDED' | 'REMOVED'>[] = [
        'CASTING_START',
        'CASTING_LOOP',
        'CASTING_CANCEL', 
        'CASTING_INTERRUPT',
        'CASTING_FINISH', 
        'CHARGES_CHANGED',
        'CHARGES_LOOP',
        'TARGETING_START',
        'TARGETING_CANCEL',
        'TARGETING_FINISH'
    ]
}

export namespace AbilContainer {
    export type Event = 'ADDED' | 'REMOVED' |
                        'CASTING_START' | 'CASTING_LOOP' |'CASTING_CANCEL' | 
                        'CASTING_INTERRUPT' | 'CASTING_FINISH' | 
                        'CHARGES_CHANGED' | 'CHARGES_LOOP' |
                        'TARGETING_START' | 'TARGETING_CANCEL' | 'TARGETING_FINISH'

    export const actions = new EventActions<AbilContainer.Event,
                                            [AbilContainer, Abil<any>, number]>
                                            (AbilContainer.name)

}