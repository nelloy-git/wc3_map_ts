import * as Handle from '../../../src/Handle'

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
    get icon_normal(){return this.type.icon(this.abil)}
    get icon_disabled(){return this.type.dis_icon(this.abil)}
    get tooltip(){return this.type.tooltip(this.abil, false)}
    get tooltipFull(){return this.type.tooltip(this.abil, true)}
    get life_cost(){return this.type.life_cost(this.abil)}
    get mana_cost(){return this.type.mana_cost(this.abil)}
    get range(){return this.type.range(this.abil)}
    get area(){return this.type.area(this.abil)}
    get charges_use(){return this.type.charges_use(this.abil)}
    get charges_max(){return this.type.charges_max(this.abil)}
    get charge_cd(){return this.type.charge_cd(this.abil)}
    get is_available(){return this.type.is_available(this.abil)}
    consume(target: T){return this.type.consume(this.abil, target)}

    readonly id: number
    readonly owner: Handle.hUnit
    readonly abil: IFace<T>
    readonly Charges: Charges
    readonly type: TData<T>
}