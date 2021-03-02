// // import {} from '.'
// import { getFilePath, FileText, BuildtimeCache, Log } from "../../Utils";

// let __path__ = Macro(getFilePath())

// export class JsonCache {
//     constructor(path: string){
//         if (!IsGame()){
//             let f = new TextFile(path)
//             // Optimize .json format
//             JsonCache._cache.set(path, Json.encode(Json.decode(f.read())))
//         }

//         let raw = JsonCache._cache.get(path)
//         if (typeof raw !== 'string'){
//             Log.err('can not load json. ' + path,
//                     __path__, JsonCache, 3)
//         }

//         this.path = path
//         this._raw = Json.decode(<string>raw)
//     }

//     readonly path: string
//     protected readonly _raw: LuaTable

//     static _cache = new BuildtimeCache(JsonCache.name)
// }