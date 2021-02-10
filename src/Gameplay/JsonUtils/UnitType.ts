import { id2int, isReforged, Json } from "../../Utils";
import { Map as Wc3Map, FieldUnitList, tUnit } from "../../Binary"
import { hUnit } from "../../Handle"
import { JsonCache } from "./Cache";
import { readJsonParams, ReadonlyJsonParams } from "./Params";
import { readNumber, readString, readTable } from "./Read";

import * as Abil from '../../AbilityExt'
import * as Buff from '../../Buff'
import * as Param from '../../Parameter'

class UnitInstHidden {
    constructor(id: number, x: number, y: number, owner: jplayer){
        this.unit = new hUnit(id, x, y, owner)
        this.abils = new Abil.Container(this.unit)
        this.buffs = new Buff.Container(this.unit)
        this.params = new Param.UnitContainer(this.unit)
        
        UnitInstHidden._hunit2ext.set(this.unit, this)
    }

    static get(id: number): UnitInstHidden | undefined
    static get(u: junit): UnitInstHidden | undefined
    static get(u: hUnit): UnitInstHidden | undefined
    static get(id_or_junit: hUnit | junit | number): UnitInstHidden | undefined
    static get(id_or_junit: hUnit | junit | number){
        if (id_or_junit instanceof hUnit){
            return UnitInstHidden._hunit2ext.get(id_or_junit)
        }
        
        let unit = hUnit.get(id_or_junit)
        if (!unit){return}
        return UnitInstHidden._hunit2ext.get(unit)
    }
    
    readonly unit: hUnit
    readonly abils: Abil.Container
    readonly buffs: Buff.Container
    readonly params: Param.UnitContainer
    
    private static _hunit2ext = new Map<hUnit, UnitInstHidden>()
}

export class UnitInst extends UnitInstHidden {
    private constructor(id: number, x: number, y: number, owner: jplayer){
        super(id, x, y, owner)
    }

    static get(id: number): UnitInst | undefined
    static get(u: junit): UnitInst | undefined
    static get(u: hUnit): UnitInst | undefined
    static get(id_or_junit: hUnit | junit | number): UnitInst | undefined {
        return UnitInstHidden.get(id_or_junit)
    }
}

export class UnitType extends JsonCache {
    constructor(path: string){
        super(path)

        this.name = readString(this._raw, 'name', path)
        this.model = readString(this._raw, 'model', path)
        this.size_new = readNumber(this._raw, 'size_new', path)
        this.size_old = readNumber(this._raw, 'size_old', path)
        this.params = readJsonParams(readTable(this._raw, 'params', path), path)

        this.type = Wc3Map.w3u.add(id2int('hfoo'))
        this.type.setInt(FieldUnitList.HitPointsMaximumBase, 100)
        this.type.setInt(FieldUnitList.ManaMaximum, 100)
        this.type.setString(FieldUnitList.ModelFile, this.model)
    }

    new(x: number, y: number, owner: jplayer){
        let u = new UnitInstHidden(this.type.id, x, y, owner)

        u.unit.modelScale = isReforged(GetLocalPlayer()) ? this.size_new : this.size_old

        for (let param of Param.Type.list()){
            u.params.set(param, 'BASE', this.params[param])
        }
        
        return <UnitInst>u
    }

    readonly name: string
    readonly model: string
    readonly size_new: number
    readonly size_old: number
    readonly params: ReadonlyJsonParams

    protected readonly type: tUnit
}