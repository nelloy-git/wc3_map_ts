import { ParamContainer } from "../Container"
import { ActionList, Log } from "../../Utils";
import { Parameter } from "../Parameter";
import { ParamValueType } from "../Value";
import { hUnit } from "../../Handle";
import { Damage } from "../Damage/Damage";

export class ParamsUnit extends ParamContainer {
    constructor(owner: hUnit){
        super()
        this.owner = owner
        
        if (ParamsUnit._owner2container.get(owner)){
            return Log.err(ParamsUnit.name + 
                           ': already exists.', 2)
        }
        ParamsUnit._owner2container.set(owner, this)
    }

    static get(owner: hUnit){
        return ParamsUnit._owner2container.get(owner)
    }

    get(param: Parameter.Type, type: ParamValueType){
        return super.get(param, type)
    }

    set(param: Parameter.Type, type: ParamValueType, val: number){
        let res = super.set(param, type, val)
        this._applyParam(param, val)
        return res
    }

    add(param: Parameter.Type, type: ParamValueType, val: number){
        let res = super.add(param, type, val)
        this._applyParam(param, val)
        return res
    }

    protected _applyParam(param: Parameter.Type, val: number){
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
    protected _actions = new ActionList()
    
    private static _owner2container = new Map<hUnit, ParamsUnit>()
}

function addMagicAttack(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
    if (type == 'PATK'){
        let params = ParamsUnit.get(src)
        if (!params){return dmg}
        
        let m_dmg = params.get('MATK', 'RES') * (1 + Math.random() * src.dispersionDamage)
        Damage.deal(src, dst, m_dmg, 'MATK', WEAPON_TYPE_WHOKNOWS)
    }
    return dmg
}

function applyProtection(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
    if (type == 'PATK' || type == 'PSPL'){
        let params = ParamsUnit.get(dst)
        if (!params){return dmg}

        let pdef = params.get('PDEF', 'RES')
        let pres = params.get('PRES', 'RES')

        return (dmg * (1 - pres)) - pdef
    } else if (type == 'MATK' || type == 'MSPL'){
        let params = ParamsUnit.get(dst)
        if (!params){return dmg}

        let mdef = params.get('MDEF', 'RES')
        let mres = params.get('MRES', 'RES')

        return (dmg * (1 - mres)) - mdef
    }

    return dmg
}

function applyCrit(this: void, src: hUnit, dst: hUnit, dmg: number, type: Damage.Type){
    let params = ParamsUnit.get(dst)
    if (!params){return dmg}

    if (Math.random() < params.get('CRIT', 'RES')){dmg = dmg * 2}
    return dmg
}

Damage.addModifier(0, addMagicAttack)
Damage.addModifier(1, applyProtection)
Damage.addModifier(2, applyCrit)