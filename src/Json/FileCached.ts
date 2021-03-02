import { BuildtimeCache, Log, FileText, getFilePath } from "../Utils";
import { File } from "../WcIO";

import { encode, decode } from './JsonLua/index'

const __path__ = Macro(getFilePath())

export class JsonFileCached {
    constructor(path: string){
        if (!IsGame()){
            // Optimize json format
            if (FileText.isExist(GetSrc() + '/' + path)){
                let f = new FileText()
                f.read(GetSrc() + '/' + path)
                if (f.data){
                    JsonFileCached._cache.set(path, encode(decode(f.data)))
                }
            } else {
                Log.err('can not find file ' + GetSrc() + path,
                        __path__, JsonFileCached, 2)
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
            let f = new FileText()
            f.write(str)
        }
    }

    readonly path: string

    static _cache = new BuildtimeCache(JsonFileCached.name)
}