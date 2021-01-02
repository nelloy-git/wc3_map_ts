import { Logger } from "./Logger"
let Log = Logger.Default

export class BuilderCache <K extends BuilderData, V extends BuilderData> {
    constructor(id: number){
        this.id = id
        let keys: K[] = <K[]>BuilderCache._cached_keys[id]
        let vals: V[] = <V[]>BuilderCache._cached_vals[id]

        if (IsGame() && (!keys || !vals)){
            Log.err(BuilderCache.name + 
                    ': can not load cache data for id: ' + this.id.toString())
        }

        if (!IsGame()){
            if (keys || vals){
                Log.err(BuilderCache.name + 
                    ': id ' + this.id.toString() + ' is already used.')            
            }
            
            keys = []
            vals = []
            BuilderCache._cached_keys[id] = keys
            BuilderCache._cached_vals[id] = vals
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
            return Log.err(BuilderCache.name + 
                           ': can be used in buildtime only.')
        }

        let index = this._keys.indexOf(key)
        if (index < 0){this._keys.push(key); index = this._keys.length - 1}
        this._vals[index] = val
    }

    readonly id: number

    private _keys: K[] = []
    private _vals: V[] = []

    private static _cached_keys: BuilderData[] = (()=>{
        let keys: BuilderData[] = []
        BuildFinal(()=>{
            keys = Macro(keys)
        })
        return keys
    })()

    private static _cached_vals: BuilderData[] = (()=>{
        let vals: BuilderData[] = []
        BuildFinal(()=>{
            vals = Macro(vals)
        })
        return vals
    })()
}