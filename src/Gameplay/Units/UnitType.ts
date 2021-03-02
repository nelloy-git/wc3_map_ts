// import { id2int, isReforged, Log} from "../../Utils";
// // import { Map as Wc3Map, FieldUnitList, tUnit } from "../../Binary"
// import { hUnit } from "../../Handle"
// import { JsonCache } from "../JsonUtils/Cache";
// import { readJsonParams, ReadonlyJsonParams } from "../JsonUtils/Params";
// import { readNumber, readString, readStringArray, readTable } from "../JsonUtils/Read";

// import * as Abil from '../../AbilityExt'
// import * as Buff from '../../Buff'
// import * as Param from '../../Parameter'

// import * as AbilityList from '../Abilities'

// class UnitInstHidden {
//     constructor(id: number, x: number, y: number, owner: jplayer){
//         this.unit = new hUnit(id, x, y, owner)
//         this.abils = new Abil.Container(this.unit)
//         this.buffs = new Buff.Container(this.unit)
//         this.params = new Param.UnitContainer(this.unit)
        
//         UnitInstHidden._hunit2ext.set(this.unit, this)
//     }

//     static get(id: number): UnitInstHidden | undefined
//     static get(u: junit): UnitInstHidden | undefined
//     static get(u: hUnit): UnitInstHidden | undefined
//     static get(id_or_junit: hUnit | junit | number): UnitInstHidden | undefined
//     static get(id_or_junit: hUnit | junit | number){
//         if (id_or_junit instanceof hUnit){
//             return UnitInstHidden._hunit2ext.get(id_or_junit)
//         }
        
//         let unit = hUnit.get(id_or_junit)
//         if (!unit){return}
//         return UnitInstHidden._hunit2ext.get(unit)
//     }
    
//     readonly unit: hUnit
//     readonly abils: Abil.Container
//     readonly buffs: Buff.Container
//     readonly params: Param.UnitContainer
    
//     private static _hunit2ext = new Map<hUnit, UnitInstHidden>()
// }

// export class UnitInst extends UnitInstHidden {
//     private constructor(id: number, x: number, y: number, owner: jplayer){
//         super(id, x, y, owner)
//     }

//     static get(id: number): UnitInst | undefined
//     static get(u: junit): UnitInst | undefined
//     static get(u: hUnit): UnitInst | undefined
//     static get(id_or_junit: hUnit | junit | number): UnitInst | undefined {
//         return UnitInstHidden.get(id_or_junit)
//     }
// }

// export class UnitTypeJsonData extends JsonCache {
//     constructor(path: string){
//         super(path)

//         this.name = readString(this._raw, 'name', path)
//         this.model = readString(this._raw, 'model', path)
//         this.size_new = readNumber(this._raw, 'size_new', path)
//         this.size_old = readNumber(this._raw, 'size_old', path)
//         this.params = readJsonParams(readTable(this._raw, 'params', path), path)
//         this.abils = this._readAbilities()

//         // this.type = <tUnit><unknown>null
//         // this.type = Wc3Map.w3u.add(id2int('hfoo'))
//         // this.type.setInt(FieldUnitList.HitPointsMaximumBase, 100)
//         // this.type.setInt(FieldUnitList.ManaMaximum, 100)
//         // this.type.setString(FieldUnitList.ModelFile, this.model)
//     }

//     new(x: number, y: number, owner: jplayer){
//         // let u = new UnitInstHidden(this.type.id, x, y, owner)
//         let u = new UnitInstHidden(0, x, y, owner)

//         u.unit.modelScale = isReforged(GetLocalPlayer()) ? this.size_new : this.size_old

//         for (let param of Param.Type.list()){
//             u.params.set(param, 'BASE', this.params[param])
//         }

//         let i = 0
//         for (let cur of this.abils){
//             if (cur){u.abils.set(i, cur)}
//             i++
//         }
        
//         return <UnitInst>u
//     }

//     private _readAbilities(){
//         let abils: Abil.TAbility<any>[] = []
//         let abil_str = readStringArray(this._raw, 'abils', this.path)
        
//         let i = 0
//         for (let abil of abil_str){
//             let found: Abil.TAbility<any> | undefined
//             for (let k in AbilityList){
//                 let cur = (<{[k:string]: any}><unknown>AbilityList)[k]

//                 if (abil == k && cur instanceof Abil.TAbility){
//                     found = cur
//                     break
//                 }
//             }

//             if (!found){
//                 Log.wrn('Can not find ability \"' + abil + '\"')
//                 continue
//             }

//             abils[i] = found
//             i++
//         }

//         return abils
//     }

//     readonly name: string
//     readonly model: string
//     readonly size_new: number
//     readonly size_old: number
//     readonly params: ReadonlyJsonParams
//     readonly abils: (Abil.TAbility<any> | undefined)[]

//     // protected readonly type: tUnit
// }