import * as Abil from '../../../AbilityExt'

import { getFilePath, Log } from "../../../Utils";

let __path__ = Macro(getFilePath())

export abstract class AbilityData {
    constructor(buff: Abil.IFace<any>){
        this._abil = buff
        AbilityData._abil2data.set(buff, this)
    }

    static get(buff: Abil.IFace<any>){
        let data = this._abil2data.get(buff)
        if (!data){
            return Log.err('data is undefined.',
                            __path__, AbilityData, 2)
        }
        return data
    }

    destroy(){
        AbilityData._abil2data.delete(this._abil)
    }
    
    private _abil: Abil.IFace<any>
    
    private static _abil2data = new Map<Abil.IFace<any>, AbilityData>()
}