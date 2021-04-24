import type { Buff } from "../Buff";

export class TDuration<T> {

    get start(){return this._start}
    set start(f: ((buff: Buff<T>) => void)){this._start = f}
    
    get period(){return this._period}
    set period(f: ((buff: Buff<T>) => void)){this._period = f}
    
    get cancel(){return this._cancel}
    set cancel(f: ((buff: Buff<T>) => void)){this._cancel = f}
    
    get finish(){return this._finish}
    set finish(f: ((buff: Buff<T>) => void)){this._finish = f}
    
    get condition(){return this._condition}
    set condition(f: ((buff: Buff<T>) => boolean)){this._condition = f}

    get addStack(){return this._addStack}
    set addStack(f: ((buff: Buff<T>, base: Buff<T>) => void)){this._addStack = f}

    protected _start: (buff: Buff<T>) => void = ()=>{}
    protected _period: (buff: Buff<T>) => void = ()=>{}
    protected _cancel: (buff: Buff<T>) => void = ()=>{}
    protected _finish: (buff: Buff<T>) => void = ()=>{}
    protected _condition: (buff: Buff<T>) => boolean = ()=>{return true}
    protected _addStack: (buff: Buff<T>, base: Buff<T>) => void = ()=>{}
}