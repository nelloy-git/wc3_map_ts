// import { getFilePath, Log} from "../Utils";
// import { File } from '../WcIO'

// import { JsonFileIFace } from './FileIFace'
// import { encode, decode } from './JsonLua/index'

// let __path__ = Macro(getFilePath())

// export class FileGame implements JsonFileIFace {
//     constructor(path: string){
//         if (!IsGame()){
//             Log.err('can not be used in buildtime.',
//                     __path__, FileGame, 2)
//         }
//         this.path = path
//     }

//     read(pl: jplayer, callback: (this: void, f: FileGame)=>void){
//         File.read(this.path, pl, (path, pl, data)=>{
//             this.__data = decode(data)
//             callback(this)
//         })
//     }

//     write(pl: jplayer){
//         let str = encode(this.__data ? this.__data : '{}')
//         File.write(this.path, pl, str)
//     }

//     get data(){return this.__data}

//     readonly path: string
//     private __data: LuaTable | undefined
// }