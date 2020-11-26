import { ParamContainer } from "./Container"
import { ActionList, Log } from "../Utils";
import { ParamType } from "./Type";
import { ParamValueType } from "./Value";
import { Unit } from "../Handle";

export class ParamUnit extends ParamContainer {
    constructor(owner: Unit){
        super()
        this.owner = owner
        
        if (ParamUnit._owner2container.get(owner)){
            return Log.err(ParamUnit.name + 
                           ': already exists.', 2)
        }
        ParamUnit._owner2container.set(owner, this)
    }

    static get (owner: Unit){
        return ParamUnit._owner2container.get(owner)
    }

    get (param: ParamType, type: ParamValueType){
        return this._values.get(param)?.get(type) as number
    }

    set (param: ParamType, type: ParamValueType, val: number){
        let res = this._values.get(param)?.set(type, val) as number
        this._applyParam(param, val)
        return res
    }

    add (param: ParamType, type: ParamValueType, val: number){
        let res = this._values.get(param)?.add(type, val) as number
        this._applyParam(param, val)
        return res
    }

    protected _applyParam(param: ParamType, val: number){
        if (param == ParamType.PATK){
            this.owner.baseDamage = val
        } else if (param == ParamType.PSPD){
            this.owner.attackCooldown = (1 / val) * this.owner.attackCooldownDefault
        } else if (param == ParamType.LIFE){
            this.owner.lifeMax = val
        } else if (param == ParamType.REGE){
            this.owner.lifeRegen = val
        } else if (param == ParamType.MANA){
            this.owner.manaMax = val
        } else if (param == ParamType.RECO){
            this.owner.manaRegen = val
        } else if (param == ParamType.MOVE){
            this.owner.moveSpeed = val
        }
    }

    readonly owner: Unit;
    protected _actions = new ActionList()
    
    private static _owner2container = new Map<Unit, ParamUnit>()
}