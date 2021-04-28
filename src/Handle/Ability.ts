import { EventActions } from "../Utils";
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
        this.actions = new EventActions(this.toString())
        this.owner.actions.link(hAbility.__unit_event_map, this.actions, () => {return [this]})
        this.actions.link(hAbility.__global_event_map, hAbility.actions)
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
        this.actions.destroy()
        UnitRemoveAbility(this.owner.handle, this.id)
        super.destroy()
    }

    readonly type_id: number
    readonly owner: hUnit
    readonly actions: EventActions<hAbility.Event, [hAbility]>

    static readonly __global_event_map: ReadonlyMap<hAbility.Event, hAbility.Event> = new Map([
        ['CAST', 'CAST'],
        ['CHANNEL', 'CHANNEL'],
        ['EFFECT', 'EFFECT'],
        ['FINISH', 'FINISH'],
        ['ENDCAST', 'ENDCAST'],
    ])

    static readonly __unit_event_map: ReadonlyMap<hUnit.Event, hAbility.Event> = new Map([
        ['SPELL_CAST', 'CAST'],
        ['SPELL_CHANNEL', 'CHANNEL'],
        ['SPELL_EFFECT', 'EFFECT'],
        ['SPELL_FINISH', 'FINISH'],
        ['SPELL_ENDCAST', 'ENDCAST'],
    ])
}

export namespace hAbility {
    export type Event = 'CAST' | 'CHANNEL' | 'EFFECT' | 'FINISH' | 'ENDCAST'
    // export type Event = 'SPELL_CAST' | 'SPELL_CHANNEL' | 'SPELL_EFFECT' | 'SPELL_FINISH' | 'SPELL_ENDCAST'
    export type FieldVal = boolean | number | string
    export type Field = jabilitybooleanfield | jabilityintegerfield | jabilityrealfield | jabilitystringfield 
    export const actions = new EventActions<hAbility.Event,
                                            [hAbility]> (hAbility.name)
}