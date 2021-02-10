import { tUnit } from "../Binary"
import { hUnit } from "../Handle"

import * as Abil from '../AbilityExt'
import * as Buff from '../Buff'
import * as Param from '../Parameter'

export class UnitExt {
    constructor(type: tUnit, x: number, y: number, owner: jplayer){
        this.unit = new hUnit(type.id, x, y, owner)
        UnitExt._hunit2ext.set(this.unit, this)

        this.type = type
        this.abils = new Abil.Container(this.unit)
        this.buffs = new Buff.Container(this.unit)
        this.params = new Param.UnitContainer(this.unit)
    }

    static get(id: number): UnitExt|undefined
    static get(u: junit): UnitExt|undefined
    static get(u: hUnit): UnitExt|undefined
    static get(id_or_junit: hUnit | junit | number){
        if (id_or_junit instanceof hUnit){
            return UnitExt._hunit2ext.get(id_or_junit)
        }
        
        let unit = hUnit.get(id_or_junit)
        if (!unit){ return }
        return UnitExt._hunit2ext.get(unit)
    }

    readonly unit: hUnit

    readonly type: tUnit
    readonly abils: Abil.Container
    readonly buffs: Buff.Container
    readonly params: Param.UnitContainer

    private static _hunit2ext = new Map<hUnit, UnitExt>()
}