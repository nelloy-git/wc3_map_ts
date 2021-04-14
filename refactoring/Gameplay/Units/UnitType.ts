import * as Abil from '../../AbilityExt'
import * as Buff from '../../Buff'
import * as Binary from '../../../src/Binary'
import * as Json from '../../../src/Json'
import * as Param from '../../Parameter'
import * as Utils from '../../../src/Utils'
import { hUnit } from '../../../src/Handle'

import * as AbilList from '../Abilities'
import { ParamsJson } from '../JsonUtils'
import { Vec3 } from '../../../src/Math'

const NAME = ['name']
const ICON = ['icon']
const DISICON = ['disIcon']
const MODEL = ['model']
const SIZE_HD = ['sizeHD']
const SIZE_SD = ['sizeSD']
const PARAM_BASE = ['baseParams']
const PARAM_MULT = ['multParams']
const PARAM_ADD = ['addParams']
const ABILS = ['abils']

export class GameplayUnitType extends Json.Cached {
    constructor(w3u: Binary.w3uFile, json_path: string){
        super(json_path)
        
        let data = this.data

        this.id = w3u.getFreeId()
        this.name = data.getString(NAME, 'unfined')
        this.icon = data.getString(ICON, 'unfined')
        this.dis_icon = data.getString(DISICON, 'unfined')
        this.model = data.getString(MODEL, 'unfined')
        this.size_hd = data.getNumber(SIZE_HD, 1)
        this.size_sd = data.getNumber(SIZE_SD, 1)

        this.base_params = new ParamsJson(data.getSub(PARAM_BASE))
        this.mult_params = new ParamsJson(data.getSub(PARAM_MULT))
        this.add_params = new ParamsJson(data.getSub(PARAM_ADD))

        this.abils = this._readAbilities()

        let tunit = new Binary.TUnit()
        tunit.id = this.id
        tunit.origin_id = 'hfoo'
        tunit.changes.push(new Binary.TUnitFieldChange(Binary.TUnitField.ModelFile, this.model))
        w3u.objects.push(tunit)
    }

    create(x: number, y: number, owner: jplayer){        
        let unit = new hUnit(Utils.id2int(this.id), owner)
        unit.pos = new Vec3(x, y, 0)
        let abils = new Abil.Container(unit)
        let params = new Param.UnitContainer(unit)
        new Buff.Container(unit)

        unit.model_scale = Utils.isReforged(GetLocalPlayer()) ? this.size_hd : this.size_sd

        for (let param of Param.Type.list()){
            let base = this.base_params.values.get(param)
            params.set(param, 'BASE', base ? base : 0)

            let mult = this.mult_params.values.get(param)
            params.set(param, 'MULT', mult ? mult : 1)

            let add = this.add_params.values.get(param)
            params.set(param, 'ADD', add ? add : 0)
        }

        for (let i = 0; i < this.abils.length; i++){
            const cur = this.abils[i]
            if (cur){abils.set(i, cur)}
        }
        
        return unit
    }

    private _readAbilities(){
        let abils: Abil.TAbility<Abil.TargetType[]>[] = []

        let data = this.data.getSub(ABILS)

        let i = 1
        while (data.isExist([i])){
            let name = data.getString([i])
            i++

            let found: Abil.TAbility<Abil.TargetType[]> | undefined
            for (let k in AbilList){
                let cur = (<{[k:string]: Abil.TargetType[]}><unknown>AbilList)[k]

                if (name == k && cur instanceof Abil.TAbility){
                    found = cur
                    break
                }
            }

            // print(name, found)

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
}