import * as Abil from '../../AbilityExt'
import { getFilePath, Log } from "../../Utils";

let __path__ = Macro(getFilePath())

export abstract class CastingData {
    constructor(buff: Abil.IFace<Abil.TargetType[]>){
        this._abil = buff
        CastingData._abil2data.set(buff, this)
    }

    static get(abil: Abil.IFace<Abil.TargetType[]>){
        let data = this._abil2data.get(abil)
        if (!data){
            return Log.err('data is undefined.',
                            __path__, CastingData, 2)
        }
        return data
    }

    detach(){
        CastingData._abil2data.delete(this._abil)
    }
    
    private _abil: Abil.IFace<Abil.TargetType[]>
    
    private static _abil2data = new Map<Abil.IFace<Abil.TargetType[]>, CastingData>()
}