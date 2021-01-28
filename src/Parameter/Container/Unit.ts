import { Log } from "../../Utils";
import { ValueType } from "../Value";
import { hUnit } from "../../Handle";

import { Container } from "../Container"
import { Damage } from "../Damage/Damage";
import { Type } from "../Type";

export class UnitContainer extends Container {
    constructor(owner: hUnit){
        super()
        this.owner = owner
        
        if (UnitContainer._owner2container.get(owner)){
            return Log.err(UnitContainer.name + 
                           ': already exists.', 2)
        }
        UnitContainer._owner2container.set(owner, this)

        for (let [param, value] of this._values){
            this.set(param, 'BASE', Type.defaultUnitBase(param))
        }
    }

    static get(owner: hUnit){
        return UnitContainer._owner2container.get(owner)
    }

    set(param: Type, type: ValueType, val: number){
        let min = Type.unitMin(param)
        let max = Type.unitMax(param)
        val = val < min ? min : val > max ? max : val

        let res = super.set(param, type, val)
        this._applyParam(param, res)
        return res
    }

    add(param: Type, type: ValueType, val: number){
        let min = Type.unitMin(param)
        let max = Type.unitMax(param)
        let cur = super.get(param, type)
        val += cur
        val = val < min ? min : val > max ? max : val

        let res = super.set(param, type, val)
        this._applyParam(param, res)
        return res
    }

    protected _applyParam(param: Type, val: number){
        switch (param){
            case 'PATK':{this.owner.baseDamage = val; break}
            case 'PSPD':{
                // 0.5 attacks per sec is default (PSPD = 1 (100%))
                this.owner.attackCooldown = 2 / val
                break}
            case 'LIFE':{this.owner.lifeMax = val; break}
            case 'REGE':{this.owner.lifeRegen = val; break}
            case 'MANA':{this.owner.manaMax = val; break}
            case 'RECO':{this.owner.manaRegen = val; break}
            case 'MOVE':{this.owner.moveSpeed = val; break}
        }
    }

    readonly owner: hUnit;
    
    private static _owner2container = new Map<hUnit, UnitContainer>()
}

function addMagicAttack(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
    if (type == 'PATK'){
        let params = UnitContainer.get(src)
        if (!params){return dmg}
        
        let m_dmg = params.get('MATK', 'RES') * (1 + Math.random() * src.dispersionDamage)
        Damage.deal(src, dst, m_dmg, 'MATK', WEAPON_TYPE_WHOKNOWS)
    }
    return dmg
}

function applyProtection(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
    if (type == 'PATK' || type == 'PSPL'){
        let params = UnitContainer.get(dst)
        if (!params){return dmg}

        let pdef = params.get('PDEF', 'RES')
        let pres = params.get('PRES', 'RES')

        return (dmg * (1 - pres)) - pdef
    } else if (type == 'MATK' || type == 'MSPL'){
        let params = UnitContainer.get(dst)
        if (!params){return dmg}

        let mdef = params.get('MDEF', 'RES')
        let mres = params.get('MRES', 'RES')

        return (dmg * (1 - mres)) - mdef
    }

    return dmg
}

function applyCrit(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
    let params = UnitContainer.get(dst)
    if (!params){return dmg}

    if (Math.random() < params.get('CRIT', 'RES')){dmg = dmg * 2}
    return dmg
}

Damage.addModifier(0, addMagicAttack)
Damage.addModifier(1, applyProtection)
Damage.addModifier(2, applyCrit)