import { getFilePath, Log} from "../Utils";
import { File } from '../WcIO'

import { encode, decode } from './JsonLua/index'

let __path__ = Macro(getFilePath())

export class JsonFileGame {
    constructor(path: string){
        if (!IsGame()){
            Log.err('can not be used in buildtime.',
                    __path__, JsonFileGame, 2)
        }
        this.path = path
    }

    read(pl: jplayer, callback: (this: void, f: JsonFileGame)=>void){
        File.read(this.path, pl, (path, pl, data)=>{this.__data = decode(data); callback(this)})
    }

    write(pl: jplayer, data: LuaTable){
        let str = encode(data)
        File.write(this.path, pl, str)
    }

    get data(){return this.__data}

    readonly path: string
    private __data: LuaTable | undefined
}