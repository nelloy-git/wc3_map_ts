// import { JsonCache } from "./Cache";
// import { readString} from "./Read";

// export class BuffJsonData extends JsonCache {
//     constructor(path: string){
//         super(path)

//         this.name = readString(this._raw, 'name', path)
//         this.icon = readString(this._raw, 'icon', path)
//         this.tooltip = readString(this._raw, 'tooltip', path)
//     }

//     get<T>(field: string){
//         return <T><unknown>(<LuaHash>this._raw)[field]
//     }

//     readonly name: string
//     readonly icon: string
//     readonly tooltip: string
// }