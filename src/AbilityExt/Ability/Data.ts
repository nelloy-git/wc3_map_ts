import { hUnit } from "../../Handle";

import { Charges } from "./Charges";
import { TData } from "../Type/Data";
import { TargetType } from "../Utils";
import { DataIFace, IFace } from "./IFace";


export class Data<T extends TargetType> implements DataIFace<T>{
    constructor(abil: IFace<T>, id: number, owner: hUnit, type: TData<T>){
        this.id = id
        this.owner = owner
        this.abil = abil
        this._type = type
        this.Charges = new Charges()
    }

    get name(){return this._type.name(this.abil)}
    get icon_normal(){return this._type.iconNormal(this.abil)}
    get icon_disabled(){return this._type.iconDisabled(this.abil)}
    get tooltip(){return this._type.tooltip(this.abil)}
    get life_cost(){return this._type.lifeCost(this.abil)}
    get mana_cost(){return this._type.manaCost(this.abil)}
    get range(){return this._type.range(this.abil)}
    get area(){return this._type.area(this.abil)}
    get charges_use(){return this._type.chargeUsed(this.abil)}
    get charges_max(){return this._type.chargeMax(this.abil)}
    get charge_cd(){return this._type.chargeCooldown(this.abil)}
    get is_available(){return this._type.isAvailable(this.abil)}
    consume(target: T){return this._type.consume(this.abil, target)}

    readonly id: number
    readonly owner: hUnit
    readonly abil: IFace<T>
    readonly Charges: Charges

    private _type: TData<T>
}