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

        this.Casting = new Casting(this, type.TCasting)
        this.Charges = new Charges(this, type.TCharges)
        this.Data = new Data(this, type.TData)
        this.Targeting = new Targeting(this, type.TTargeting)

        this.Casting.actions.add('START', () => {this.__runActions('CASTING_START')})
        this.Casting.actions.add('LOOP', () => {this.__runActions('CASTING_LOOP')})
        this.Casting.actions.add('CANCEL', () => {this.__runActions('CASTING_CANCEL')})
        this.Casting.actions.add('INTERRUPT', () => {this.__runActions('CASTING_INTERRUPT')})
        this.Casting.actions.add('FINISH', () => {this.__runActions('CASTING_FINISH')})

        this.Charges.actions.add('CHANGED', () => {this.__runActions('CHARGES_CHANGED')})
        this.Charges.actions.add('LOOP', () => {this.__runActions('CHARGES_LOOP')})

        this.Targeting.actions.add('START', () => {this.__runActions('TARGETING_START')})
        this.Targeting.actions.add('CANCEL', () => {this.__runActions('TARGETING_CANCEL')})
        this.Targeting.actions.add('FINISH', () => {this.__runActions('TARGETING_FINISH')})

        this.__runActions('NEW')
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
        this.__runActions('DESTROY')

        this.Casting.destroy()
        this.Charges.destroy()
    }

    private __runActions(event: Abil.Event){
        Abil.actions.run(event, this)
        this.actions.run(event, this)
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
}   

export namespace Abil {
    export type Event = 'NEW' | 'DESTROY' |
                        'CASTING_START' | 'CASTING_LOOP' |'CASTING_CANCEL' | 
                        'CASTING_INTERRUPT' | 'CASTING_FINISH' | 
                        'CHARGES_CHANGED' | 'CHARGES_LOOP' |
                        'TARGETING_START' | 'TARGETING_CANCEL' | 'TARGETING_FINISH'

    export const actions = new EventActions<Abil.Event,
                                            [Abil<any>]>
                                            (Abil.name)
}