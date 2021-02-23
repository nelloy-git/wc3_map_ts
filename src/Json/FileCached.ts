import { BuildtimeCache, TextFile } from "../Utils";

import { encode, decode } from './JsonLua/index'

export class JsonFileCached {
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
        JsonFileCached._cache.set(this.path, str)

        if (!IsGame()){
            let f = new TextFile(GetSrc() + '/' + this.path)
            f.write(str)
        }
    }

    readonly path: string

    static _cache = new BuildtimeCache(JsonFileCached.name)
}