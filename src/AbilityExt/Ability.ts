import { Unit } from '../Handle'
import { AbilitySynced } from './Ability/Synced'
import { Charges, Event as ChargesEvent } from './Charges'
import { Type } from './Type'

export class Ability extends AbilitySynced {
    constructor(owner: Unit, type: Type){
        super(owner, type)
        this.charges.addAction(ChargesEvent.COUNT_CHANGED, ()=>{this._updateCharges()})
    }

    protected _updateCharges(){
        this.charges.cooldown = this.type.data.chargeCooldown(this)
        this.charges.countMax = this.type.data.chargeMax(this)
    }

    readonly charges = new Charges()
}