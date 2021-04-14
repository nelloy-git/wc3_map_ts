import { EventActions, EventActionsMap } from "../Utils";
import { Handle } from "./Handle";
import { hUnit } from './Unit'

export class hAbility extends Handle<jability> {
    constructor(type_id: number, owner: hUnit){
        super(((): jability=>{
            UnitAddAbility(owner.handle, type_id)
            return BlzGetUnitAbility(owner.handle, type_id)
        })())

        this.type_id = type_id
        this.owner = owner
        this.actions = new EventActions(this as hAbility, Handle.wcType(this.handle))
    }

    static get(id: jability | number): hAbility | undefined{
        return Handle.get(id, 'ability') as hAbility | undefined
    }
    
    getField(field: jabilitybooleanfield): boolean
    getField(field: jabilityintegerfield): number
    getField(field: jabilityrealfield): number
    getField(field: jabilitystringfield): string
    getField(field: hAbility.Field){
        let t = Handle.wcType(field)
        if (t == hUnit.FieldType.boolean){
            return BlzGetAbilityBooleanField(this.handle, <jabilitybooleanfield>field)
        } else if (t == hUnit.FieldType.integer){
            return BlzGetAbilityIntegerField(this.handle, <jabilityintegerfield>field)
        } else if (t == hUnit.FieldType.real){
            return BlzGetAbilityRealField(this.handle, <jabilityrealfield>field)
        } else if (t == hUnit.FieldType.string){
            return BlzGetAbilityStringField(this.handle, <jabilitystringfield>field)
        }
    }

    setField(val: boolean, field: jabilitybooleanfield): void
    setField(val: number, field: jabilityintegerfield): void
    setField(val: number, field: jabilityrealfield): void
    setField(val: string, field: jabilitystringfield): void
    setField(val: hAbility.FieldVal, field: hAbility.Field){
        let t = Handle.wcType(field)
        if (t == hUnit.FieldType.boolean){
            BlzSetAbilityBooleanField(this.handle, <jabilitybooleanfield>field, <boolean>val)
        } else if (t == hUnit.FieldType.integer){
            BlzSetAbilityIntegerField(this.handle, <jabilityintegerfield>field, Math.floor(<number>val))
        } else if (t == hUnit.FieldType.real){
            BlzSetAbilityRealField(this.handle, <jabilityrealfield>field, <number>val)
        } else if (t == hUnit.FieldType.string){
            BlzSetAbilityStringField(this.handle, <jabilitystringfield>field, <string>val)
        }
    }

    destroy(){
        UnitRemoveAbility(this.owner.handle, this.id)
        super.destroy()
    }

    readonly type_id: number
    readonly owner: hUnit
    readonly actions: EventActions<hUnit.Event, hAbility>
}

export namespace hAbility {
    export type Event = 'SPELL_CAST' | 'SPELL_CHANNEL' | 'SPELL_EFFECT' | 'SPELL_FINISH' | 'SPELL_ENDCAST'
    export type FieldVal = boolean | number | string
    export type Field = jabilitybooleanfield | jabilityintegerfield | jabilityrealfield | jabilitystringfield 
    export const ActionAny = new EventActions<hAbility.Event,
                                              typeof hAbility,
                                              [hAbility]> (hAbility, hAbility.name)

    export const ActionId = new EventActionsMap<number,
                                                hAbility.Event,
                                                typeof hAbility,
                                                [hAbility]> (hAbility, hAbility.name)


    hUnit.ActionAny.add('SPELL_CAST', __runActions)
    hUnit.ActionAny.add('SPELL_CHANNEL', __runActions)
    hUnit.ActionAny.add('SPELL_EFFECT', __runActions)
    hUnit.ActionAny.add('SPELL_FINISH', __runActions)
    hUnit.ActionAny.add('SPELL_ENDCAST', __runActions)

    function __runActions(this: void, owner: typeof hUnit, event: hUnit.Event, caster: hUnit){

        let abil = hAbility.get(GetSpellAbility())
        if (!abil){
            return
        }

        ActionAny.run(event as Event, abil)
        ActionId.run(abil.type_id, event as Event, abil)
        abil.actions.run(event as Event)
    }

}