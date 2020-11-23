import { Unit } from '../Handle'
import { AbilitySynced } from './Ability/Synced'
import { Charges } from './Charges'
import { Type } from './Type'

export class Ability extends AbilitySynced {
    constructor(owner: Unit, type: Type){
        super(owner, type)
        this._charges.addAction('COUNT_CHANGED', ()=>{this._updateCharges()})
    }

    protected _updateCharges(){
        this._charges.cooldown = this.type.data.chargeCooldown(this)
        this._charges.countMax = this.type.data.chargeMax(this)
    }

    private _charges = new Charges()
}