import { getFilePath, Log} from "../Utils";
import { File } from '../WcIO'

import { encode, decode } from './JsonLua/index'
import { JsonFileIface } from './FileIface'

let __path__ = Macro(getFilePath())

export class JsonFileGame implements JsonFileIface {
    constructor(path: string){
        if (!IsGame()){
            Log.err('can not be used in buildtime.',
                    __path__, JsonFileGame, 2)
        }
        this.path = path
    }

    read(){
        let f = new File(this.path)
        let raw = f.read()

        return (typeof raw === 'string') ? decode(raw) : undefined
    }

    write(data: LuaTable){
        let str = encode(data)
        let f = new File(this.path)
        f.write(str)
    }

    readonly path: string
}