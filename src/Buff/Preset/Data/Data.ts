import { IFace } from "../../Buff/IFace";

export class BuffData {
    constructor(buff: IFace<any>){
        this._buff = buff
        BuffData._buff2data.set(buff, this)
    }

    static get(buff: IFace<any>){
        return this._buff2data.get(buff)
    }

    destroy(){
        BuffData._buff2data.delete(this._buff)
    }
    
    private _buff: IFace<any>
    
    private static _buff2data = new Map<IFace<any>, BuffData>()
}