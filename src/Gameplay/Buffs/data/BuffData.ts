import * as Buff from '../../../Buff'

import { getFilePath, Log } from "../../../Utils";

let __path__ = Macro(getFilePath())

export class BuffData {
    constructor(buff: Buff.IFace<any>){
        this._buff = buff
        BuffData._buff2data.set(buff, this)
    }

    static get(buff: Buff.IFace<any>){
        let data = this._buff2data.get(buff)
        if (!data){
            return Log.err('data is undefined.',
                            __path__, BuffData, 2)
        }
        return data
    }

    destroy(){
        BuffData._buff2data.delete(this._buff)
    }
    
    private _buff: Buff.IFace<any>
    
    private static _buff2data = new Map<Buff.IFace<any>, BuffData>()
}