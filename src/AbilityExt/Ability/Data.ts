import * as Handle from '../../Handle'

import { Charges } from "./Charges";
import { TData } from "../Type/Data";
import { DataIFace, IFace, TargetType } from "./IFace";


export class Data<T extends TargetType[]> implements DataIFace<T>{
    constructor(abil: IFace<T>, id: number, owner: Handle.hUnit, type: TData<T>){
        this.id = id
        this.owner = owner
        this.abil = abil
        this.type = type
        this.Charges = new Charges()
    }

    get name(){return this.type.name(this.abil)}
    get icon_normal(){return this.type.iconNormal(this.abil)}
    get icon_disabled(){return this.type.iconDisabled(this.abil)}
    get tooltip(){return this.type.tooltip(this.abil)}
    get life_cost(){return this.type.lifeCost(this.abil)}
    get mana_cost(){return this.type.manaCost(this.abil)}
    get range(){return this.type.range(this.abil)}
    get area(){return this.type.area(this.abil)}
    get charges_use(){return this.type.chargeUsed(this.abil)}
    get charges_max(){return this.type.chargeMax(this.abil)}
    get charge_cd(){return this.type.chargeCooldown(this.abil)}
    get is_available(){return this.type.isAvailable(this.abil)}
    consume(target: T){return this.type.consume(this.abil, target)}

    readonly id: number
    readonly owner: Handle.hUnit
    readonly abil: IFace<T>
    readonly Charges: Charges
    readonly type: TData<T>
}