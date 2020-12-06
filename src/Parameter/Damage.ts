import { hUnit } from "../Handle";
import { Trigger } from "../Handle/Trigger";
import { TriggerEvent } from "../Handle/TriggerEvent";
import { Action } from "../Utils";

export namespace Damage {

    export function addModifier(priority: number,
                                modif: (src: hUnit,
                                        dst: hUnit,
                                        dmg: number,
                                        type: jdamagetype)=>number){
        
        let list = _modifiers.get(priority)
        if (!list){list = []}
        list.push(new Action(modif))
        _modifiers.set(priority, list)
        _modifiers = new Map([..._modifiers].sort((d1, d2)=>{return d1[0] > d2[0] ? 1 : -1}))
    }

    function _applyModifiers(){
        let src = hUnit.getDamageSource()
        let dst = hUnit.getDamageSource()
        let dmg = GetEventDamage()
        let type = BlzGetEventDamageType()

        if (!src || !dst){return}

        _modifiers.forEach(list => {
            for (let i = 0; i < list.length; i++){
                dmg = list[i].run(src as hUnit, dst as hUnit, dmg, type)
            }
        });

        BlzSetEventDamage(dmg < 0 ? 0 : dmg)
    }

    let _modifiers = new Map<number, Action<[hUnit, hUnit, number, jdamagetype], number>[]>()
    let _trigger = new Trigger()
    for (let i = 0; i < bj_MAX_PLAYER_SLOTS - 1; i++){
        let pl = Player(0)
        let event = TriggerEvent.newPlayerUnitEvent(pl, EVENT_PLAYER_UNIT_DAMAGING)
        event.applyToTrigger(_trigger)
    }
}