import { hUnit } from "../Handle";
import { ActionList } from "../Utils";

import { Container } from "./Container"
import { Type, List } from "./Type";
import { Value, ValueType } from "./Value";

let __path__ = Macro(getFilePath())

export class ContainerUnit extends Container {
    constructor(owner: hUnit){
        super()
        this.owner = owner
        
        if (ContainerUnit._owner2container.get(owner)){
            return Log.err('already exists.',
                            __path__, ContainerUnit, 2)
        }
        ContainerUnit._owner2container.set(owner, this)

        for (let [param, value] of this._values){                       
            this.set(param, 'BASE', Type.defaultUnitBase(param))
        }
    }

    static get(owner: hUnit){
        return ContainerUnit._owner2container.get(owner)
    }

    set(param: Type, type: ValueType, val: number){
        let min = Type.unitMin(param)
        let max = Type.unitMax(param)

        let res = super.set(param, type, val)
        res = res < min ? min : res > max ? max : res
        this._applyParam(param, res)
        return res
    }

    add(param: Type, type: ValueType, val: number){
        let min = Type.unitMin(param)
        let max = Type.unitMax(param)
        let cur = super.get(param, type)
        val += cur
        
        let res = super.set(param, type, val)
        res = res < min ? min : res > max ? max : res
        this._applyParam(param, res)
        return res
    }

    protected _applyParam(param: Type, val: number){
        if (param == 'PATK'){this.owner.baseDamage = val} else
        // 0.5 attacks per sec is default (PSPD = 1 (100%))
        if (param == 'PSPD'){this.owner.atkCd = 2 / val} else
        if (param == 'LIFE'){this.owner.life_max = val} else
        if (param == 'REGE'){this.owner.lifeRegen = val} else
        if (param == 'MANA'){this.owner.mana_max = val} else
        if (param == 'RECO'){this.owner.manaRegen = val} else
        if (param == 'MOVE'){this.owner.move_spd = val}
    }

    readonly actions: ActionList<ContainerUnit, [Type]>
    readonly owner: hUnit
    
    private static _owner2container = new Map<hUnit, ContainerUnit>()
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