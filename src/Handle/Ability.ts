import { Action, ActionList, getFilePath, Log, wcType } from "../Utils";
import { Handle } from "./Handle";
import { hTrigger } from './Trigger'
import { hTriggerEvent } from './TriggerEvent'
import { hUnit } from './Unit'

let __path__ = Macro(getFilePath())

export class hAbility extends Handle<jability> {
    constructor(abil_id: number, owner: hUnit){
        super(((): jability=>{
            UnitAddAbility(owner.handle, abil_id)
            return BlzGetUnitAbility(owner.handle, abil_id)
        })())

        this.abil_id = abil_id
        this.owner = owner
        this.__actions = new Map()
    }

    static get(id: jability | number): hAbility | undefined{
        return Handle.get(id, 'ability') as hAbility | undefined
    }

    static addIdAction(id: number, event: hAbility.Event, callback: hAbility.IdCallback){
        let id_events = hAbility.__id_actions.get(id)
        if (!id_events){
            id_events = new Map()
            this.__id_actions.set(id, id_events)
        }

        let id_actions = id_events.get(event)
        if (!id_actions){
            id_actions = new ActionList()
            id_events.set(event, id_actions)
        }

        return id_actions.add(callback)
    }

    static removeIdAction(action: hAbility.IdAction){
        let found = false
        for (let [id, map] of this.__id_actions){
            for (let [event, list] of map){
                found = list.remove(action)
                if (found){break}
            }
        }
        return found
    }

    addAction(event: hAbility.Event, callback: hAbility.Callback){
        let actions = this.__actions.get(event)
        if (!actions){
            actions = new ActionList()
            this.__actions.set(event, actions)
        }

        return actions.add(callback)
    }

    removeAction(action: hAbility.hAction){
        let found = false
        for (let [event, list] of this.__actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    destroy(){
        UnitRemoveAbility(this.owner.handle, this.id)
        super.destroy()
    }

    readonly abil_id: number
    readonly owner: hUnit

    private __actions: Map<hAbility.Event, ActionList<[hAbility, hAbility.Event]>>

    private static __runActions(this: void,
                                event: hAbility.Event){
        let u = hUnit.getSpellCaster()
        if (u == undefined){
            return
        }

        let abil_id = GetSpellAbilityId()
        let abil_events = hAbility.__id_actions.get(abil_id)
        if (abil_events){
            let id_actions = abil_events.get(event)
            if (id_actions){
                id_actions.run(abil_id, event, u)
            }
        }

        let abil = hAbility.get(GetSpellAbility())
        if (abil){
            let actions = abil.__actions.get(event)
            if (actions){
                actions.run(abil, event)
            }
        }
    }

    private static __id_actions = new Map<number, Map<hAbility.Event, ActionList<[number, hAbility.Event, hUnit]>>>()

    private static __triggers = IsGame() ? (() => {
        let map = new Map<hAbility.Event, hTrigger>()

        for (let [name, wc3_event] of hAbility.__event2jass){
            let tr = new hTrigger()
            map.set(name, tr)

            for (let i = 0; i < bj_MAX_PLAYER_SLOTS - 1; i++){
                hTriggerEvent.newPlayerUnitEvent(Player(i), wc3_event).applyToTrigger(tr)
            }
            tr.addAction(() => {hAbility.__runActions(name)})
        }
        return map

    })() : <Map<hAbility.Event, hTrigger>><unknown>undefined

    private static __event2jass = new Map<hAbility.Event, jplayerunitevent>([
        ['CAST', EVENT_PLAYER_UNIT_SPELL_CAST],
        ['CHANNEL', EVENT_PLAYER_UNIT_SPELL_CHANNEL],
        ['EFFECT', EVENT_PLAYER_UNIT_SPELL_EFFECT],
        ['ENDCAST', EVENT_PLAYER_UNIT_SPELL_ENDCAST],
        ['FINISH', EVENT_PLAYER_UNIT_SPELL_FINISH],
    ])
}

export namespace hAbility {
    export type Event = 'CAST' | 'CHANNEL' | 'EFFECT' | 'FINISH' | 'ENDCAST'
    export type IdCallback = (id: number, event: hAbility.Event, caster: hUnit) => void
    export type Callback = (abil: hAbility, event: hAbility.Event) => void
    export type IdAction = Action<[id: number, event: hAbility.Event, caster: hUnit], void>
    export type hAction = Action<[abil: hAbility, event: hAbility.Event], void>
}