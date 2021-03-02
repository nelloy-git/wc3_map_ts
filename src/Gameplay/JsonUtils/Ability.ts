// import * as Param from '../../Parameter'

// import { JsonCache } from "./Cache";
// import { readNumber, readString, readTable } from "./Read";
// import { readScale, ReadonlyScaleJsonData } from './Scales'
// import { getFilePath, Log } from "../../Utils";

// let __path__ = Macro(getFilePath())

// export class AbilityJsonData extends JsonCache {
//     constructor(path: string){
//         super(path)

//         this.name = readString(this._raw, 'name', path)
//         this.icon = readString(this._raw, 'icon', path)
//         this.dis_icon = readString(this._raw, 'disIcon', path)
//         this.tooltip = readString(this._raw, 'tooltip', path)
//         this.cast_time = readNumber(this._raw, 'castTime', path)

//         this._animations = readTable(this._raw, 'animations', path)

//         this._scales = {}
//         let raw_scales = readTable(this._raw, 'scales', path)
//         for (let key in raw_scales){
//             this._scales[key] = readScale(<LuaTable>raw_scales[key], path)
//         }
//     }

//     get(field: string){
//         return (<LuaHash>this._raw)[field]
//     }

//     getAnimation(key: string, anim: string){
//         let anim_list = this._animations[key]
//         if (typeof anim_list !== 'object'){
//             return Log.err('animation list \"' + key + '\" is not declared in ' + this.path,
//                             __path__, AbilityJsonData, 2)
//         }
        
//         let res = (<LuaHash>anim_list)[anim]
//         if (!(typeof res === 'number' || typeof res === 'string')){
//             return Log.err('animation \"' + key + '.' + anim + '\" is not declared in ' + this.path,
//                             __path__, AbilityJsonData, 2)
//         }

//         return res
//     }

//     getScaledValue(key: string, params?: Param.Container){
//         let scale = this._scales[key]
//         if (!scale){
//             return Log.err('scale \"' + key + '\" is not declared in ' + this.path,
//                             __path__, AbilityJsonData, 2)
//         }

//         let base = scale.base
//         let baseMult = 1
//         let baseAdd = 0
//         let resultMult = 1

//         if (params){
//             for (let p of Param.Type.list()){
//                 let val = params.get(p, 'RES')
//                 baseMult += val * scale.baseMult[p]
//                 baseAdd += val * scale.baseAdd[p]
//                 resultMult += val * scale.resultMult[p]
//             }
//         }

//         return (base * baseMult + baseAdd) * resultMult
//     }

//     readonly name: string
//     readonly icon: string
//     readonly dis_icon: string
//     readonly tooltip: string
//     readonly cast_time: number

//     private readonly _animations: LuaHash
//     private readonly _scales: {[key: string]: ReadonlyScaleJsonData | undefined}
// }