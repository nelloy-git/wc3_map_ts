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