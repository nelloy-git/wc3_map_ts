import * as Abil from '../AbilityExt'

export abstract class AbilData {
    constructor(buff: Abil.IFace<any>){
        this._abil = buff
        AbilData._buff2data.set(buff, this)
    }

    static get(buff: Abil.IFace<any>){
        return this._buff2data.get(buff)
    }

    destroy(){
        AbilData._buff2data.delete(this._abil)
    }
    
    private _abil: Abil.IFace<any>
    
    private static _buff2data = new Map<Abil.IFace<any>, AbilData>()
}