import { hUnit } from "../../Handle";
import { Trigger } from "../../Handle/Trigger";
import { TriggerEvent } from "../../Handle/TriggerEvent";
import { Action, Color, Log } from "../../Utils";

import { Shield } from "./Shield";
import { DamageType, type2wc, wc2type } from "./Type";

export namespace Damage {

    export type Type = DamageType
    export function getColor(type: Damage.Type){
        switch (type){
            case 'PATK': {return new Color(0.9, 0.1, 0.1, 0.8)}
            case 'PSPL': {return new Color(0.9, 0.1, 0.1, 0.8)}
            case 'MATK': {return new Color(0.1, 0.1, 0.9, 0.8)}
            case 'MSPL': {return new Color(0.1, 0.1, 0.9, 0.8)}
            case 'CATK': {return new Color(0.9, 0.9, 0.9, 0.8)}
            case 'CSPL': {return new Color(0.9, 0.9, 0.9, 0.8)}
        }
    }

    export function deal(src: hUnit, dst: hUnit,
                         amount: number, type: Damage.Type, sound: jweapontype){
        let wc_type = type2wc.get(type)
        if (!wc_type){return Log.err('Damage: unknown damage type.')}
        UnitDamageTarget(src.handle, dst.handle, amount, false, false, ATTACK_TYPE_CHAOS, wc_type, sound)
    }

    export function addModifier(priority: number,
                                modif: (this: void,
                                        src: hUnit,
                                        dst: hUnit,
                                        dmg: number,
                                        type: Damage.Type)=>number){
        
        let list = _modifiers.get(priority)
        if (!list){list = []}
        list.push(new Action(modif))
        _modifiers.set(priority, list)

        // Sort by priority
        _modifiers = new Map([..._modifiers].sort((d1, d2)=>{return d1[0] < d2[0] ? 1 : -1}))
    }

    function _applyModifiers(this: void){
        let src = hUnit.getDamageSource()
        let dst = hUnit.getDamageTarget()
        let dmg = GetEventDamage()
        let type = wc2type.get(BlzGetEventDamageType())

        if (!src || !dst || !type){return}

        for (let [priority, list] of _modifiers){
            for (let i = 0; i < list.length; i++){
                dmg = list[i].run(src as hUnit, dst as hUnit, dmg, type)
            }
        }

        dmg = Shield.consume(type, dst, dmg)
        BlzSetEventDamage(dmg < 0 ? 0 : dmg)
    }

    let _modifiers = new Map<number, Action<[hUnit, hUnit, number, Damage.Type], number>[]>()

    if (IsGame()){
        let _trigger = new Trigger()
        _trigger.addAction(_applyModifiers)
        for (let i = 0; i < bj_MAX_PLAYER_SLOTS - 1; i++){
            let pl = Player(i)
            let event = TriggerEvent.newPlayerUnitEvent(pl, EVENT_PLAYER_UNIT_DAMAGING)
            event.applyToTrigger(_trigger)
        }
    }
}