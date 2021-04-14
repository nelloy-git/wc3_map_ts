import { hUnit } from "../../src/Handle";

import { IFace, TargetType } from "./Ability/IFace";

import { Casting } from "./Ability/Casting";
import { Data } from "./Ability/Data";
import { Targeting } from "./Ability/Targeting";

import { TCasting } from './Type/Casting'
import { TData } from './Type/Data'
import { TTargeting } from './Type/Targeting'
import { Action, ActionList } from "../../src/Utils";

export class TAbility<T extends TargetType[]>{
    constructor(
        public TCasting: TCasting<T>, 
        public TData: TData<T>,
        public TTargeting: TTargeting<T>){   
    }
}

export class Ability<T extends TargetType[]> implements IFace<T> {
    constructor(owner: hUnit, type: TAbility<T>){
        let id = IFace.register(this)

        this.Casting = new Casting(this, type.TCasting)
        this.Data = new Data(this, id, owner, type.TData)
        this.Targeting = new Targeting(this, type.TTargeting)

        Ability.__actions.get('NEW')?.run(<any>this, 'NEW')
    }

    static addAction(event: Ability.Event,
                     callback: (this: void, abil: Ability<TargetType[]>, event: Ability.Event) => void){
        return this.__actions.get(event)?.add(callback)
    }

    static removeAction(action: Action<[Ability<TargetType[]>], void> | undefined){
        for (let [event, list] of this.__actions){
            if (list.remove(action)){return true}
        }
        return false
    }

    readonly Casting: Casting<T>
    readonly Data: Data<T>
    readonly Targeting: Targeting<T>

    private static __actions = new Map<Ability.Event, ActionList<[Ability<TargetType[]>, Ability.Event]>>([
        ['NEW', new ActionList()]
    ])
}

export namespace Ability {
    export type Event = 'NEW'
}