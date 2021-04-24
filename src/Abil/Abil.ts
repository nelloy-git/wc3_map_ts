import { Vec2 } from '../Math'
import { hUnit } from "../Handle";

import type { TAbil } from './TAbil'

import { Casting } from "./Casting/Instance";
import { Charges } from "./Charges/Instance";
import { Data } from "./Data/Instance";
import { Targeting } from "./Targeting/Instance";

import { Action, ActionList, EventActions } from "../Utils";

export type TargetType = hUnit | Vec2

export class Abil<T extends TargetType[]> {
    constructor(owner: hUnit, type: TAbil<T>){
        this.id = Abil.__register(this)
        this.owner = owner
        this.type = type

        this.Casting = new Casting(this, type.TCasting)
        this.Charges = new Charges(this, type.TCharges)
        this.Data = new Data(this, type.TData)
        this.Targeting = new Targeting(this, type.TTargeting)

        // Abil.__actions.get('NEW')?.run(<any>this, 'NEW')
    }

    static get(id: number | undefined){
        if (!id){
            return undefined
        }
        return Abil.__id2abil.get(id)
    }

    destroy(){
        // TODO
    }

    // static addAction(event: Ability.Event,
    //                  callback: (this: void, abil: Abil<TargetType[]>, event: Ability.Event) => void){
    //     // return this.__actions.get(event)?.add(callback)
    // }

    // static removeAction(action: Action<[Abil<TargetType[]>], void> | undefined){
    //     // for (let [event, list] of this.__actions){
    //     //     if (list.remove(action)){return true}
    //     // }
    //     // return false
    // }

    readonly id: number
    readonly owner: hUnit
    readonly type: TAbil<T>
    // readonly actions: EventActions

    readonly Casting: Casting<T>
    readonly Charges: Charges<T>
    readonly Data: Data<T>
    readonly Targeting: Targeting<T>

    // private static actions = new Map<Ability.Event, ActionList<[Abil<TargetType[]>, Ability.Event]>>([
    //     ['NEW', new ActionList()]
    // ])

    private static __id2abil = new Map<number, Abil<any>>()
    private static __last_id = 0
    private static __register(abil: Abil<any>){
        Abil.__last_id++
        Abil.__id2abil.set(Abil.__last_id, abil)
        return Abil.__last_id
    }
}   

export namespace Ability {
    export type Event = 'NEW'
}