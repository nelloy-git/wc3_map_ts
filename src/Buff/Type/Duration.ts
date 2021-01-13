import { IFace } from "../Buff/IFace";

export class TDuration<T> {

    get start(){return this._start}
    set start(f: ((buff: IFace<T>) => void)){this._start = f}
    
    get period(){return this._period}
    set period(f: ((buff: IFace<T>) => void)){this._period = f}
    
    get cancel(){return this._cancel}
    set cancel(f: ((buff: IFace<T>) => void)){this._cancel = f}
    
    get finish(){return this._finish}
    set finish(f: ((buff: IFace<T>) => void)){this._finish = f}
    
    get condition(){return this._condition}
    set condition(f: ((buff: IFace<T>) => boolean)){this._condition = f}

    private _start: (buff: IFace<T>) => void = ()=>{}
    private _period: (buff: IFace<T>) => void = ()=>{}
    private _cancel: (buff: IFace<T>) => void = ()=>{}
    private _finish: (buff: IFace<T>) => void = ()=>{}
    private _condition: (buff: IFace<T>) => boolean = ()=>{return true}
}