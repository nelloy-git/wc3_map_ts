import { getFilePath } from './Funcs'
import { Logger } from "./Logger"
let Log = Logger.Default

let __path__ = Macro(getFilePath())

export class BuildtimeCache <T extends BuildtimeData> {
    constructor(id: number | string){
        this.id = id
        this._cache = (<LuaHash>BuildtimeCache._global_cache)[id]

        if (IsGame() && (!this._cache)){
            Log.err('can not load cache data for id: ' + this.id.toString(),
                    __path__, BuildtimeCache, 3)
        }

        if (!IsGame()){
            if (this._cache){
                Log.err('id ' + this.id.toString() + ' is already used.',
                        __path__, BuildtimeCache, 3)
            }
            
            this._cache = {};
            (<LuaHash>BuildtimeCache._global_cache)[id] = this._cache
        }
    }

    get(key: string): T{
        return <T>(<LuaHash>this._cache)[key]
    }

    set(key: string, val: T){
        if (IsGame()){
            return Log.err('can be used in buildtime only.',
                            __path__, BuildtimeCache, 2)
        }
        (<LuaHash>this._cache)[key] = val
    }

    readonly id: string | number
    private _cache: BuildtimeData

    private static _global_cache: BuildtimeData = (()=>{
        let cache = MacroFinal(()=>{return BuildtimeCache._global_cache})
        cache = cache ? cache : {}
        return cache
    })()
}

export namespace BuildtimeCache {
    export let Default = new BuildtimeCache<string>(BuildtimeCache.name)
}