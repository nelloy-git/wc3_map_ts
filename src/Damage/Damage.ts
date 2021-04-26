import { hUnit } from "../Handle";
import { Action } from "../Utils";

import { Type } from "./Type";

export class Damage {
    private constructor(){}
}

export namespace Damage {

    export type Modifier = (this: void, src: hUnit, dst: hUnit, dmg: number, t: Type) => number

    export function deal(src: hUnit, dst: hUnit,
                         amount: number, type: Type,
                         sound: jweapontype = WEAPON_TYPE_WHOKNOWS){
        UnitDamageTarget(src.handle, dst.handle, amount,
                         false, false, ATTACK_TYPE_CHAOS, __type2wc[type], sound)
    }

    export function addModifier(priority: number,
                                modif: Modifier){
        
        let list = __modifiers.get(priority)
        list = list ? list : []

        let action = new Action(modif, Damage.name)
        list.push(action)
        __modifiers.set(priority, list)

        // Sort by priority
        __modifiers = new Map([...__modifiers].sort((d1, d2)=>{return d1[0] < d2[0] ? 1 : -1}))
    }

    function __applyModifiers(this: void, src: hUnit, dst: hUnit, t: Type){
        let dmg = GetEventDamage()

        for (let [priority, list] of __modifiers){
            for (let i = 0; i < list.length; i++){
                dmg = list[i].run(src, dst, dmg, t)
            }
        }
        BlzSetEventDamage(dmg < 0 ? 0 : dmg)
    }

    let __modifiers = new Map<number, Action<[hUnit, hUnit, number, Type], number>[]>()

    if (IsGame()){
        hUnit.actions.add('DAMAGING', (event, src) => {
            let dst = hUnit.get(BlzGetEventDamageTarget())
            let type = find(__type2wc, BlzGetEventDamageType())

            if (!dst || !type){
                return
            }
            __applyModifiers(src, dst, type)
        })
    }

    function find<K extends string | number | symbol, V>(r: Record<K, V>, val: V){
        for (const k in r){
            if (val == r[k]){
                return k
            }
        }
        return undefined
    }

    const __type2wc: Record<Type, jdamagetype> = {
        PATK: DAMAGE_TYPE_NORMAL,
        MATK: DAMAGE_TYPE_ENHANCED,
        CATK: DAMAGE_TYPE_UNIVERSAL,
        PSPL: DAMAGE_TYPE_FORCE,
        MSPL: DAMAGE_TYPE_MAGIC,
        CSPL: DAMAGE_TYPE_UNKNOWN,
    }
}