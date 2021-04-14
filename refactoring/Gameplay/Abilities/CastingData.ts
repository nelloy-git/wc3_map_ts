import * as Abil from '../../AbilityExt'
import { getFilePath, Log } from "../../../src/Utils";

let __path__ = Macro(getFilePath())

export abstract class CastingData {
    constructor(abil: Abil.IFace<Abil.TargetType[]>){
        this.__abil = abil
        CastingData.__abil2data.set(abil, this)
    }

    static get(abil: Abil.IFace<Abil.TargetType[]>){
        let data = this.__abil2data.get(abil)
        if (!data){
            return Log.err('data is undefined.',
                            __path__, CastingData, 2)
        }
        return data
    }

    detach(){
        CastingData.__abil2data.delete(this.__abil)
    }
    
    private __abil: Abil.IFace<Abil.TargetType[]>
    
    private static __abil2data = new Map<Abil.IFace<Abil.TargetType[]>, CastingData>()
}