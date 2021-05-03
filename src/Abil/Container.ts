import { EventActions } from "../Utils";
import { hUnit } from "../Handle";

import { Abil, TargetType } from './Abil'
import { TAbil } from './TAbil'

export class AbilContainer {
    constructor(owner: hUnit){
        if (AbilContainer.__owner2container.get(owner)){
            error(AbilContainer.name + ': ability container for ' + owner.toString() + ' already exists.', 2)
        }
        AbilContainer.__owner2container.set(owner, this)

        this.owner = owner
        this.actions = new EventActions(this.toString())
        this.actions.link(AbilContainer.__global_event_map, AbilContainer.actions)

        this.__list = new Map()
        this.__convert = (e, [abil]) => {return [this, abil]}
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
            prev.destroy()
        }

        if (type){
            let abil = new Abil<any>(this.owner, type)
            this.__list.set(pos, abil)

            abil.actions.link(AbilContainer.__abil_event_map, this.actions, this.__convert)

            abil.actions.add('DESTROY', () => {
                let pos = find(this.__list, abil)
                if (pos){
                    this.__list.delete(pos)
                    this.actions.run('REMOVED', this, abil)
                }
            })

            this.actions.run('ADDED', this, abil)
        }
    }

    get(i: number): Readonly<Abil<TargetType[]>> | undefined{
        return this.__list.get(i)
    }

    destroy(){
        for (const [pos, abil] of this.__list){
            abil.destroy()
        }
        AbilContainer.__owner2container.delete(this.owner)
    }

    readonly owner: hUnit;
    readonly actions: EventActions<AbilContainer.Event, [inst: AbilContainer, abil: Abil<any>]>

    private __list: Map<number, Abil<TargetType[]>>
    private __convert: (this: void, e: Abil.Event, abil: [Abil<any>]) => [AbilContainer, Abil<any>]

    private static __owner2container = new Map<hUnit, AbilContainer>()

    private static __global_event_map: ReadonlyMap<AbilContainer.Event, AbilContainer.Event> = new Map([
        ['ADDED', 'ADDED'],
        ['REMOVED', 'REMOVED'],
        ['CASTING_START', 'CASTING_START'],
        ['CASTING_LOOP', 'CASTING_LOOP'],
        ['CASTING_CANCEL', 'CASTING_CANCEL'], 
        ['CASTING_INTERRUPT', 'CASTING_INTERRUPT'],
        ['CASTING_FINISH', 'CASTING_FINISH'],
        ['CHARGES_ADDED', 'CHARGES_ADDED'],
        ['CHARGES_REMOVED', 'CHARGES_REMOVED'],
        ['CHARGES_LOOP', 'CHARGES_LOOP'],
        ['TARGETING_START', 'TARGETING_START'],
        ['TARGETING_CANCEL', 'TARGETING_CANCEL'],
        ['TARGETING_FINISH', 'TARGETING_FINISH']
    ])

    private static __abil_event_map: ReadonlyMap<Abil.Event, AbilContainer.Event> = new Map([
        ['CASTING_START', 'CASTING_START'],
        ['CASTING_LOOP', 'CASTING_LOOP'],
        ['CASTING_CANCEL', 'CASTING_CANCEL'], 
        ['CASTING_INTERRUPT', 'CASTING_INTERRUPT'],
        ['CASTING_FINISH', 'CASTING_FINISH'],
        ['CHARGES_ADDED', 'CHARGES_ADDED'],
        ['CHARGES_REMOVED', 'CHARGES_REMOVED'],
        ['CHARGES_LOOP', 'CHARGES_LOOP'],
        ['TARGETING_START', 'TARGETING_START'],
        ['TARGETING_CANCEL', 'TARGETING_CANCEL'],
        ['TARGETING_FINISH', 'TARGETING_FINISH']
    ])
}

export namespace AbilContainer {
    export type Event = 'ADDED' | 'REMOVED' |
                        'CASTING_START' | 'CASTING_LOOP' |'CASTING_CANCEL' | 
                        'CASTING_INTERRUPT' | 'CASTING_FINISH' | 
                        'CHARGES_ADDED' | 'CHARGES_REMOVED' | 'CHARGES_LOOP' |
                        'TARGETING_START' | 'TARGETING_CANCEL' | 'TARGETING_FINISH'

    export const actions = new EventActions<AbilContainer.Event,
                                            [AbilContainer, Abil<any>]>
                                            (AbilContainer.name)

}

function find<K,V>(map: Map<K, V>, val: V){
    for (const [k,v] of map){
        if (v == val){
            return k
        }
    }
    return undefined
}