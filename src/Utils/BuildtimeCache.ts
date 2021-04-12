import { Logger } from "./Logger"
let Log = Logger.Default

let __path__ = Macro(getFilePath())

export class BuildtimeCache <T extends BuildtimeData> {
    constructor(id: number | string){
        this.id = id
        let cache = <BuildtimeTable | undefined>BuildtimeCache.__global_cache.get(id)

        if (cache == undefined){
            if (IsGame()){
                Log.err('can not load cache data for id: ' + this.id.toString(),
                        __path__, BuildtimeCache, 3)
            }
            
            cache = new LuaTable<number | string, BuildtimeData>();
            BuildtimeCache.__global_cache.set(id, cache)
        } else {
            if (!IsGame()){
                Log.err('id ' + this.id.toString() + ' is already used.',
                        __path__, BuildtimeCache, 3)
            }
        }

        // print('Contructor: ', id, cache)
        this.__cache = <BuildtimeTable>cache
    }

    get(key: string): T{
        return <T>this.__cache.get(key)
    }

    set(key: string, val: T){
        if (IsGame()){
            return Log.err('can be used in buildtime only.',
                            __path__, BuildtimeCache, 2)
        }
        // print(this.id, key)
        this.__cache.set(key, val)
    }

    readonly id: string | number
    private __cache: BuildtimeTable

    private static __global_cache: BuildtimeTable = (()=>{
        let cache = MacroFinal<BuildtimeTable>(()=>{return BuildtimeCache.__global_cache})
        cache = cache != undefined ? cache : new LuaTable<number | string, BuildtimeData>()
        return cache
    })()
}

export namespace BuildtimeCache {
    export let Default = new BuildtimeCache<string>(BuildtimeCache.name)
}