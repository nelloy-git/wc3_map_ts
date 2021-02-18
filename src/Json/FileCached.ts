import { BuildtimeCache, TextFile } from "../Utils";

import { encode, decode } from './JsonLua/index'
import { JsonFileIface } from './FileIface'

export class JsonFileCached implements JsonFileIface {
    constructor(path: string){
        if (!IsGame()){
            let f = new TextFile(GetSrc() + '/' + path)
            // Optimize json format
            if (TextFile.isExist(GetSrc() + '/' + path)){
                let data = f.read()
                JsonFileCached._cache.set(path, encode(decode(data)))
            }
        }
        this.path = path
    }

    read(){
        let raw = JsonFileCached._cache.get(this.path)
        return (typeof raw === 'string') ? decode(raw) : undefined
    }

    write(data: LuaTable){
        let str = encode(data)
        JsonFileCached._cache.set(this.path, data)

        if (!IsGame()){
            let f = new TextFile(this.path)
            f.write(str)
        }
    }

    readonly path: string

    static _cache = new BuildtimeCache(JsonFileCached.name)
}