import { Vec2 } from '../Math'
import { hUnit } from "../Handle";

import type { TAbil } from './TAbil'

import { Casting } from "./Casting/Instance";
import { Charges } from "./Charges/Instance";
import { Data } from "./Data/Instance";
import { Targeting } from "./Targeting/Instance";

import { EventActions } from "../Utils";

export type TargetType = hUnit | Vec2

export class Abil<T extends TargetType[]> {
    constructor(owner: hUnit, type: TAbil<T>){
        this.id = Abil.__register(this)
        this.owner = owner
        this.type = type
        this.actions = new EventActions(this.toString())
        Abil.actions.link(Abil.__global_event_map, this.actions)

        this.Casting = new Casting(this, type.TCasting)
        this.Charges = new Charges(this, type.TCharges)
        this.Data = new Data(this, type.TData)
        this.Targeting = new Targeting(this, type.TTargeting)

        this.Casting.actions.link(Abil.__casting_event_map, this.actions, (e, [abil, targ]) => {return [abil]})
        this.Charges.actions.link(Abil.__charges_event_map, this.actions)
        this.Targeting.actions.link(Abil.__targeting_event_map, this.actions, (e, [abil, pl]) => {return [abil]})

        this.actions.run('NEW', this)
    }

    static get(id: number | undefined){
        if (!id){
            return undefined
        }
        return Abil.__id2abil.get(id)
    }

    toString(){
        return this.constructor.name + '<' + this.id + '>'
    }

    destroy(){
        this.actions.run('DESTROY', this)
        this.Casting.destroy()
        this.Charges.destroy()
    }

    readonly id: number
    readonly owner: hUnit
    readonly type: TAbil<T>
    readonly actions: EventActions<Abil.Event, [Abil<T>]>

    readonly Casting: Casting<T>
    readonly Charges: Charges<T>
    readonly Data: Data<T>
    readonly Targeting: Targeting<T>

    private static __id2abil = new Map<number, Abil<any>>()
    private static __last_id = 0
    private static __register(abil: Abil<any>){
        Abil.__last_id++
        Abil.__id2abil.set(Abil.__last_id, abil)
        return Abil.__last_id
    }
    
    private static readonly __global_event_map: ReadonlyMap<Abil.Event, Abil.Event> = new Map([
        ['NEW', 'NEW'],
        ['DESTROY', 'DESTROY'],
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
        ['TARGETING_FINISH', 'TARGETING_FINISH'],
    ])

    private static readonly __casting_event_map: ReadonlyMap<Casting.Event, Abil.Event> = new Map([
        ['START', 'CASTING_START'],
        ['LOOP', 'CASTING_LOOP'],
        ['CANCEL', 'CASTING_CANCEL'],
        ['INTERRUPT', 'CASTING_INTERRUPT'],
        ['FINISH', 'CASTING_FINISH'],
    ])

    private static readonly __charges_event_map: ReadonlyMap<Charges.Event, Abil.Event> = new Map([
        ['ADDED', 'CHARGES_ADDED'],
        ['REMOVED', 'CHARGES_REMOVED'],
        ['LOOP', 'CHARGES_LOOP'],
    ])

    private static readonly __targeting_event_map: ReadonlyMap<Targeting.Event, Abil.Event> = new Map([
        ['START', 'TARGETING_START'],
        ['CANCEL', 'TARGETING_CANCEL'],
        ['FINISH', 'TARGETING_FINISH'],
    ])
}   

export namespace Abil {
    export type Event = 'NEW' | 'DESTROY' |
                        'CASTING_START' | 'CASTING_LOOP' |'CASTING_CANCEL' | 
                        'CASTING_INTERRUPT' | 'CASTING_FINISH' | 
                        'CHARGES_ADDED' | 'CHARGES_REMOVED' | 'CHARGES_LOOP' |
                        'TARGETING_START' | 'TARGETING_CANCEL' | 'TARGETING_FINISH'

    export const actions = new EventActions<Abil.Event,
                                            [Abil<any>]>
                                            (Abil.name)
}