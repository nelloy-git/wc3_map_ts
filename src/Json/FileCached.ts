import { BuildtimeCache, TextFile } from "../Utils";

import { encode, decode } from './JsonLua/index'
import { JsonFileIface } from './FileIface'

export class JsonFileCached implements JsonFileIface {
    constructor(path: string){
        if (!IsGame()){
            let f = new TextFile(path)
            // Optimize json format
            JsonFileCached._cache.set(path, encode(decode(f.read())))
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