import { Logger } from "./Logger"
let Log = Logger.Default

export class BuildtimeCache <K extends BuilderData, V extends BuilderData> {
    constructor(id: number){
        this.id = id
        let keys: K[] = <K[]>BuildtimeCache._cached_keys[id]
        let vals: V[] = <V[]>BuildtimeCache._cached_vals[id]

        if (IsGame() && (!keys || !vals)){
            Log.err(BuildtimeCache.name + 
                    ': can not load cache data for id: ' + this.id.toString())
        }

        if (!IsGame()){
            if (keys || vals){
                Log.err(BuildtimeCache.name + 
                    ': id ' + this.id.toString() + ' is already used.')            
            }
            
            keys = []
            vals = []
            BuildtimeCache._cached_keys[id] = keys
            BuildtimeCache._cached_vals[id] = vals
        }

        this._keys = keys
        this._vals = vals
    }

    get(key: K){
        let index = this._keys.indexOf(key)
        return this._vals[index]
    }

    set(key: K, val: V){
        if (IsGame()){
            return Log.err(BuildtimeCache.name + 
                           ': can be used in buildtime only.')
        }

        let index = this._keys.indexOf(key)
        if (index < 0){this._keys.push(key); index = this._keys.length - 1}
        this._vals[index] = val
    }

    static hash(str: string){
        let hash = 0
        let char
        for (let i = 0; i < str.length; i++) {
          char = str.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    readonly id: number

    private _keys: K[] = []
    private _vals: V[] = []

    private static _cached_keys: BuilderData[] = (()=>{
        let keys = MacroFinal(()=>{return BuildtimeCache._cached_keys})
        keys = keys ? keys : []
        return keys
    })()

    private static _cached_vals: BuilderData[] = (()=>{
        let vals = MacroFinal(()=>{return BuildtimeCache._cached_vals})
        vals = vals ? vals : []
        return vals
    })()
}

export namespace BuildtimeCache {
    export let Default = new BuildtimeCache<string, string>(BuildtimeCache.hash(BuildtimeCache.name))
}