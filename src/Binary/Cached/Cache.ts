// import { BuildtimeCache, Log } from "../../Utils"
// import { JsonFile } from '../../Json'
// import { File } from "../File"

// let json_dir = 'HungryMercenaries'

// export abstract class BinaryCache<T> {
//     constructor(path: string, use_custom: boolean = false){
//         let root = GetSrc()

//         if (!IsGame()){

//         }

//         super(root ? root : '', path, use_custom)

//         if (!IsGame() && !this._data){
//             // Load binary file if json does not exist.

//         }
//     }

//     protected _save(data: ReadonlyArray<T>){
//         let raw = this._elemToRaw(data[0])
//         for (let i = 1; i < data.length; i++){
//             raw += ';' + this._elemToRaw(data[i])
//         }
//         BinaryCache._cache.set(this.id, raw)
//     }

//     protected _load(): ReadonlyArray<T>{
//         let raw = BinaryCache._cache.get(this.id)

//         let data: T[] = []
//         let s_elements = raw.split(';')
//         s_elements.forEach(s_elem => {
//             data.push(this._elemFromRaw(s_elem))
//         })

//         return data
//     }

//     protected abstract _elemToRaw(elem: T): string
//     protected abstract _elemFromRaw(raw: string): T

//     readonly id: string
    
//     protected static _cache = new BuildtimeCache<string>(BinaryCache.name)
// }