import { BuilderCache, Log } from "../../Utils"

export abstract class BinaryCache<T> {
    constructor(id: string){
        if (!IsGame() && BinaryCache._cache.get(id)){
            Log.err(BinaryCache.name + 
                    ': id \'' + id + '\' is already in use.')
        }

        this.id = id
    }

    protected _save(data: ReadonlyArray<T>){
        let raw = this._elemToRaw(data[0])
        for (let i = 1; i < data.length; i++){
            raw += ';' + this._elemToRaw(data[i])
        }
        BinaryCache._cache.set(this.id, raw)
    }

    protected _load(): ReadonlyArray<T>{
        let raw = BinaryCache._cache.get(this.id)

        let data: T[] = []
        let s_elements = raw.split(';')
        s_elements.forEach(s_elem => {
            data.push(this._elemFromRaw(s_elem))
        })

        return data
    }

    protected abstract _elemToRaw(elem: T): string
    protected abstract _elemFromRaw(raw: string): T

    readonly id: string
    
    protected static _cache_id = Macro(BuilderCache.hash(BinaryCache.name))
    protected static _cache = new BuilderCache<string, string>(BinaryCache._cache_id)
}