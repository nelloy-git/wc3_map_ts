import { Log } from "../../Utils";
import { ValueType } from "../Value";
import { hUnit } from "../../Handle";

import { Container } from "../Container"
import { Damage } from "../Damage/Damage";
import { Type } from "../Type";

export class Unit extends Container {
    constructor(owner: hUnit){
        super()
        this.owner = owner
        
        if (Unit._owner2container.get(owner)){
            return Log.err(Unit.name + 
                           ': already exists.', 2)
        }
        Unit._owner2container.set(owner, this)
    }

    static get(owner: hUnit){
        return Unit._owner2container.get(owner)
    }

    set(param: Type, type: ValueType, val: number){
        let res = super.set(param, type, val)
        this._applyParam(param, res)
        return res
    }

    add(param: Type, type: ValueType, val: number){
        let res = super.add(param, type, val)
        this._applyParam(param, res)
        return res
    }

    protected _applyParam(param: Type, val: number){
        switch (param){
            case 'PATK':{this.owner.baseDamage = val; break}
            case 'PSPD':{this.owner.attackCooldown = (1 / val) * this.owner.attackCooldownDefault; break}
            case 'LIFE':{this.owner.lifeMax = val; break}
            case 'REGE':{this.owner.lifeRegen = val; break}
            case 'MANA':{this.owner.manaMax = val; break}
            case 'RECO':{this.owner.manaRegen = val; break}
            case 'MOVE':{this.owner.moveSpeed = val; break}
        }
    }

    readonly owner: hUnit;
    
    private static _owner2container = new Map<hUnit, Unit>()
}

function addMagicAttack(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
    if (type == 'PATK'){
        let params = Unit.get(src)
        if (!params){return dmg}
        
        let m_dmg = params.get('MATK', 'RES') * (1 + Math.random() * src.dispersionDamage)
        Damage.deal(src, dst, m_dmg, 'MATK', WEAPON_TYPE_WHOKNOWS)
    }
    return dmg
}

function applyProtection(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
    if (type == 'PATK' || type == 'PSPL'){
        let params = Unit.get(dst)
        if (!params){return dmg}

        let pdef = params.get('PDEF', 'RES')
        let pres = params.get('PRES', 'RES')

        return (dmg * (1 - pres)) - pdef
    } else if (type == 'MATK' || type == 'MSPL'){
        let params = Unit.get(dst)
        if (!params){return dmg}

        let mdef = params.get('MDEF', 'RES')
        let mres = params.get('MRES', 'RES')

        return (dmg * (1 - mres)) - mdef
    }

    return dmg
}

function applyCrit(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
    let params = Unit.get(dst)
    if (!params){return dmg}

    if (Math.random() < params.get('CRIT', 'RES')){dmg = dmg * 2}
    return dmg
}

Damage.addModifier(0, addMagicAttack)
Damage.addModifier(1, applyProtection)
Damage.addModifier(2, applyCrit)