import * as Buff from '../../Buff'
import { getFilePath, Log } from "../../../src/Utils";

let __path__ = Macro(getFilePath())

export class DurationData {
    constructor(buff: Buff.IFace<any>){
        this.__buff = buff
        DurationData.__buff2data.set(buff, this)
    }

    static get(buff: Buff.IFace<any>){
        let data = this.__buff2data.get(buff)
        if (!data){
            return Log.err('data is undefined.',
                            __path__, DurationData, 2)
        }
        return data
    }

    detach(){
        DurationData.__buff2data.delete(this.__buff)
    }
    
    private __buff: Buff.IFace<any>
    
    private static __buff2data = new Map<Buff.IFace<any>, DurationData>()
}