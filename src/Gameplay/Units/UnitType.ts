import * as Abil from '../../AbilityExt'
import * as Buff from '../../Buff'
import * as Binary from '../../Binary'
import * as Json from '../../Json'
import * as Param from '../../Parameter'
import * as Utils from '../../Utils'
import { hUnit } from '../../Handle'

import * as AbilList from '../Abilities'
import { ParamsJson } from '../JsonUtils'

let __path__ = Macro(Utils.getFilePath())

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

export class GameplayUnitType extends Json.FileCached {
    constructor(w3u: Binary.w3uFile, json_path: string){
        super(json_path)
        
        let data = this._file.data
        if (!data){
            Utils.Log.err(json_path + ' is empty', __path__, GameplayUnitType)
        }

        let raw = Json.decode(<string>data)
        this._raw = raw

        this.id = w3u.getFreeId()
        this.name = Json.Read.String(raw, 'name', 'unfined', json_path)
        this.icon = Json.Read.String(raw, 'icon', 'unfined', json_path)
        this.dis_icon = Json.Read.String(raw, 'disIcon', 'unfined', json_path)
        this.model = Json.Read.String(raw, 'model', 'unfined', json_path)
        this.size_hd = Json.Read.Number(this._raw, 'sizeHD', 1, json_path)
        this.size_sd = Json.Read.Number(this._raw, 'sizeSD', 1, json_path)

        let raw_base_params = Json.Read.Table(raw, 'baseParams', {}, json_path)
        this.base_params = new ParamsJson(raw_base_params, 0)

        let raw_mult_params = Json.Read.Table(raw, 'multParams', {}, json_path)
        this.mult_params = new ParamsJson(raw_mult_params, 1)
        
        let raw_add_params = Json.Read.Table(raw, 'addParams', {}, json_path)
        this.add_params = new ParamsJson(raw_add_params, 0)

        this.abils = this._readAbilities(json_path)

        let tunit = new Binary.TUnit()
        tunit.id = this.id
        tunit.origin_id = 'hfoo'
        tunit.changes.push(new Binary.TUnitFieldChange(Binary.TUnitField.ModelFile, this.model))
        w3u.objects.push(tunit)
    }

    create(x: number, y: number, owner: jplayer){        
        let unit = new hUnit(Utils.id2int(this.id), x, y, owner)
        let abils = new Abil.Container(unit)
        let params = new Param.UnitContainer(unit)
        new Buff.Container(unit)

        unit.modelScale = Utils.isReforged(GetLocalPlayer()) ? this.size_hd : this.size_sd

        for (let param of Param.Type.list()){
            params.set(param, 'BASE', this.base_params.get(param))
            params.set(param, 'MULT', this.mult_params.get(param))
            params.set(param, 'ADD', this.add_params.get(param))
        }

        for (let i = 0; i < this.abils.length; i++){
            const cur = this.abils[i]
            if (cur){abils.set(i, cur)}
        }
        
        return unit
    }

    private _readAbilities(path: string){
        let abils: Abil.TAbility<Abil.TargetType[]>[] = []
        let names = Json.Read.StringArray(this._raw, 'abils', [], path)
        
        for (const name of names){
            let found: Abil.TAbility<Abil.TargetType[]> | undefined
            for (let k in AbilList){
                let cur = (<{[k:string]: Abil.TargetType[]}><unknown>AbilList)[k]

                if (name == k && cur instanceof Abil.TAbility){
                    found = cur
                    break
                }
            }

            if (!found){
                Utils.Log.wrn('Can not find ability \"' + name + '\"')
                continue
            }

            abils.push(found)
        }

        return abils
    }

    readonly id: string
    readonly name: string
    readonly icon: string
    readonly dis_icon: string
    readonly model: string
    readonly size_hd: number
    readonly size_sd: number
    
    readonly base_params: ParamsJson
    readonly mult_params: ParamsJson
    readonly add_params: ParamsJson
    readonly abils: (Abil.TAbility<Abil.TargetType[]> | undefined)[]

    protected readonly _raw: LuaTable
}