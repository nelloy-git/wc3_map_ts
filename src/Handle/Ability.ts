import { Action, ActionList, getFilePath, Log, wcType } from "../Utils";
import { Handle } from "./Handle";
import { hTrigger } from './Trigger'
import { hTriggerEvent } from './TriggerEvent'
import { hUnit } from './Unit'

let __path__ = Macro(getFilePath())

type AbilityEvent = 'CAST'|'CHANNEL'|'EFFECT'|'FINISH'|'ENDCAST'

export class hAbility extends Handle<jability> {
    constructor(abil_id: number, owner: hUnit){
        super(((): jability=>{
            UnitAddAbility(owner.handle, abil_id)
            return BlzGetUnitAbility(owner.handle, abil_id)
        })())

        this._owner = owner
        this._abil_id = abil_id
    }
    public static get(id: jability | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'ability'){
            Log.err('got wrong type of handle.',
                    __path__, hAbility, 2)
        }
        return instance as hAbility
    }
    public static getSpell(){return hAbility.get(GetSpellAbility())}

    public owner(){ return this._owner }
    public abil_id(){ return this._abil_id }

    public addAction(event: AbilityEvent,
                     callback: (this: void, abil: hAbility, event: AbilityEvent)=>void){
        return this._actions.get(event)?.add(callback)
    }

    public removeAction(action: Action<[hAbility, AbilityEvent], void>){
        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    private static runActions(this: void,
                              event: AbilityEvent){
        let abil = hAbility.getSpell()

        abil?._actions.get(event)?.run(abil, event)
    }

    destroy(){
        if (!this._owner || ! this._abil_id){ return }
        UnitRemoveAbility(this._owner.handle, this._abil_id)
        this._owner = undefined
        this._abil_id = undefined
        super.destroy()
    }

    private _owner: hUnit | undefined;
    private _abil_id: number | undefined;
    private _actions = new Map<AbilityEvent, ActionList<[hAbility, AbilityEvent]>>([
        ['CAST', new ActionList()],
        ['CHANNEL', new ActionList()],
        ['EFFECT', new ActionList()],
        ['FINISH', new ActionList()],
        ['ENDCAST', new ActionList()]
    ])

    private static name2jevent = new Map<AbilityEvent, jplayerunitevent>([
        ['CAST', EVENT_PLAYER_UNIT_SPELL_CAST],
        ['CHANNEL', EVENT_PLAYER_UNIT_SPELL_CHANNEL],
        ['EFFECT', EVENT_PLAYER_UNIT_SPELL_EFFECT],
        ['FINISH', EVENT_PLAYER_UNIT_SPELL_FINISH],
        ['ENDCAST', EVENT_PLAYER_UNIT_SPELL_ENDCAST],
    ])

    private static newTrigger(event: AbilityEvent){
        let trig = new hTrigger()
        trig.addAction((trig: hTrigger):void => {hAbility.runActions(event)})
        for (let i = 0; i < bj_MAX_PLAYER_SLOTS - 1; i++){
            let jevent = this.name2jevent.get(event)
            if (jevent){
                let trig_event = hTriggerEvent.newPlayerUnitEvent(Player(i), jevent)
                trig_event.applyToTrigger(trig)
            }
        }
        return trig
    }

    private static _triggers = IsGame() ? new Map<AbilityEvent, hTrigger>([
        ['CAST', hAbility.newTrigger('CAST')],
        ['CHANNEL', hAbility.newTrigger('CHANNEL')],
        ['EFFECT', hAbility.newTrigger('EFFECT')],
        ['FINISH', hAbility.newTrigger('FINISH')],
        ['ENDCAST', hAbility.newTrigger('ENDCAST')],
    ]) : undefined
}