import * as Abil from '../AbilityExt'

export abstract class AbilData {
    constructor(buff: Abil.IFace<any>){
        this._abil = buff
        AbilData._abil2data.set(buff, this)
    }

    static get(buff: Abil.IFace<any>){
        return this._abil2data.get(buff)
    }

    destroy(){
        AbilData._abil2data.delete(this._abil)
    }
    
    private _abil: Abil.IFace<any>
    
    private static _abil2data = new Map<Abil.IFace<any>, AbilData>()
}