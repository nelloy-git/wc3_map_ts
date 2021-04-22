export class BuildtimeCache <T extends BuildtimeData> {
    constructor(id: number | string){
        this.id = id
        let cache = <BuildtimeTable | undefined>BuildtimeCache.__global_cache.get(id)

        if (cache == undefined){
            if (IsGame()){
                error(this.toString() + ': can not load data', 2)
            }
            
            cache = new LuaTable<number | string, BuildtimeData>();
            BuildtimeCache.__global_cache.set(id, cache)
        } else {
            if (!IsGame()){
                error(this.toString() + ': already exist.', 2)
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
            error(this.toString() + ': can be used in buildtime only.', 2)
        }
        // print(this.id, key)
        this.__cache.set(key, val)
    }

    toString(){
        return BuildtimeCache.name + '<' + this.id.toString() + '>'
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