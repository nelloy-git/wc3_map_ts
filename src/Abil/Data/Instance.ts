import { hUnit } from '../../Handle'

import type { Abil, TargetType } from '../Abil'
import type { TData } from './Type'
// import { DataIFace, IFace, TargetType } from "./IFace";


export class Data<T extends TargetType[]> {
    constructor(abil: Abil<T>, type: TData<T>){
        this.abil = abil
        this.__type = type
    }

    get name(){return this.__type.name(this.abil)}
    get icon_normal(){return this.__type.icon(this.abil)}
    get icon_disabled(){return this.__type.dis_icon(this.abil)}
    get tooltip(){return this.__type.tooltip(this.abil, false)}
    get tooltipFull(){return this.__type.tooltip(this.abil, true)}
    get life_cost(){return this.__type.life_cost(this.abil)}
    get mana_cost(){return this.__type.mana_cost(this.abil)}
    get range(){return this.__type.range(this.abil)}
    get area(){return this.__type.area(this.abil)}
    get is_available(){return this.__type.is_available(this.abil)}
    consume(target: T){return this.__type.consume(this.abil, target)}

    readonly abil: Abil<T>
    private __type: TData<T>
}