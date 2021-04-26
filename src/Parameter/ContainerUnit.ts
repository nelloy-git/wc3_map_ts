import { hUnit } from "../Handle";
import { ActionList } from "../Utils";

import { Container } from "./Container"
import { Type, List } from "./Type";
import { ValueType } from "./Value";

export class ParamContainerUnit extends Container {
    constructor(owner: hUnit){
        super()
        this.owner = owner
        this.actions = new ActionList(this.toString())
        
        if (ParamContainerUnit.__owner2container.get(owner)){
            error(ParamContainerUnit.name + ': parameter container for ' + owner.toString() + ' already exists.', 2)
        }
        ParamContainerUnit.__owner2container.set(owner, this)

        for (const p of List){
            this.set(ParamContainerUnit.Default[p], p, 'BAS')
        }
    }

    static get(owner: hUnit){
        return ParamContainerUnit.__owner2container.get(owner)
    }

    toString(){
        return this.owner.toString() + '.' + this.constructor.name
    }

    get(param: Type, type: ValueType){
        let val = super.get(param, type)
        if (type == 'RES'){
            let min = ParamContainerUnit.Min[param]
            let max = ParamContainerUnit.Max[param]
            val = val < min ? min : val > max ? max : val
        }
        return val
    }

    set(val: number, param: Type, type: Exclude<ValueType, 'RES'>){
        let min = ParamContainerUnit.Min[param]
        let max = ParamContainerUnit.Max[param]

        super.set(val, param, type)
        let res = super.get(param, type)
        res = res < min ? min : res > max ? max : res
        ParamContainerUnit.Apply[param](this.owner, res)
        this.actions.run(this, param)

        return res
    }

    add(val: number, param: Type, type: Exclude<ValueType, 'RES'>){
        let min = ParamContainerUnit.Min[param]
        let max = ParamContainerUnit.Max[param]

        super.add(val, param, type)
        let res = super.get(param, type)
        res = res < min ? min : res > max ? max : res
        ParamContainerUnit.Apply[param](this.owner, res)
        this.actions.run(this, param)

        return res
    }

    readonly owner: hUnit
    readonly actions: ActionList<[ParamContainerUnit, Type]>
    
    private static __owner2container = new Map<hUnit, ParamContainerUnit>()
}

export namespace ParamContainerUnit {
    export const Default: Record<Type, number> = {
        PATK: 1,
        PSPD: 1,
        PDEF: 0,
        PRES: 0,
        MATK: 0,
        MSPD: 1,
        MDEF: 0,
        MRES: 0,
        CRIT: 0,
        LIFE: 10,
        REGE: 0,
        MANA: 10,
        RECO: 0,
        MOVE: 300,
    }

    let def_min = Macro(-math.pow(10, 10))
    export const Min: Record<Type, number> = {
        PATK: def_min,
        PSPD: 0.01,
        PDEF: def_min,
        PRES: -1,
        MATK: def_min,
        MSPD: 0.01,
        MDEF: def_min,
        MRES: -1,
        CRIT: 0,
        LIFE: 10,
        REGE: def_min,
        MANA: 10,
        RECO: def_min,
        MOVE: def_min,
    }

    let def_max = Macro(math.pow(10, 10))
    export const Max: Record<Type, number> = {
        PATK: def_max,
        PSPD: def_max,
        PDEF: def_max,
        PRES: 1,
        MATK: def_max,
        MSPD: def_max,
        MDEF: def_max,
        MRES: 1,
        CRIT: 1,
        LIFE: def_max,
        REGE: def_max,
        MANA: def_max,
        RECO: def_max,
        MOVE: 500,
    }

    export const ATK_Dispersion = 0.3
    export const ATK_PER_SEC = 2
    export const Apply: Record<Type, (u: hUnit, val: number) => void> = {
        PATK: (u, val) => {
            u.atkDmg_0 = val
            u.atkDices_0 = 1
            u.atkDiceSides_0 =  math.ceil(val * ATK_Dispersion)
        },
        PSPD: (u, val) => {
            u.atkCd_0 = ATK_PER_SEC / val
        },
        PDEF: (u, val) => {},
        PRES: (u, val) => {},
        MATK: (u, val) => {},
        MSPD: (u, val) => {},
        MDEF: (u, val) => {},
        MRES: (u, val) => {},
        CRIT: (u, val) => {},
        LIFE: (u, val) => {
            let cur = u.life / u.life_max
            u.life_max = val
            u.life = cur * val
        },
        REGE: (u, val) => {
            u.setField(val, UNIT_RF_HIT_POINTS_REGENERATION_RATE)
        },
        MANA: (u, val) => {
            let cur = u.mana / u.mana_max
            u.mana_max = val
            u.mana = cur * val
        },
        RECO: (u, val) => {
            u.setField(val, UNIT_RF_MANA_REGENERATION)
        },
        MOVE: (u, val) => {u.move_spd = val},
    }
}

// function addMagicAttack(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
//     if (type == 'PATK'){
//         let params = ContainerUnit.get(src)
//         if (!params){return dmg}
        
//         let m_dmg = params.get('MATK', 'RES') * (1 + Math.random() * src.dispersionDamage)
//         Damage.deal(src, dst, m_dmg, 'MATK', WEAPON_TYPE_WHOKNOWS)
//     }
//     return dmg
// }

// function applyProtection(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
//     if (type == 'PATK' || type == 'PSPL'){
//         let params = ContainerUnit.get(dst)
//         if (!params){return dmg}

//         let pdef = params.get('PDEF', 'RES')
//         let pres = params.get('PRES', 'RES')

//         return (dmg * (1 - pres)) - pdef
//     } else if (type == 'MATK' || type == 'MSPL'){
//         let params = ContainerUnit.get(dst)
//         if (!params){return dmg}

//         let mdef = params.get('MDEF', 'RES')
//         let mres = params.get('MRES', 'RES')

//         return (dmg * (1 - mres)) - mdef
//     }

//     return dmg
// }

// function applyCrit(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
//     let params = ContainerUnit.get(dst)
//     if (!params){return dmg}

//     if (Math.random() < params.get('CRIT', 'RES')){dmg = dmg * 2}
//     return dmg
// }

// Damage.addModifier(0, addMagicAttack)
// Damage.addModifier(1, applyProtection)
// Damage.addModifier(2, applyCrit)