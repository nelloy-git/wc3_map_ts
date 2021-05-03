import type { Buff } from "./Buff";

export class TDuration<T> {

    constructor(){
        this._start = () => {}
        this._period = () => {}
        this._cancel = () => {}
        this._finish = () => {}
        this._condition = () => {return true}
        this._interaction = () => {return false}
    }

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

    /** Return true if "buff" should be destroyed */
    get interaction(){return this._interaction}
    /** Return true if "buff" should be destroyed */
    set interaction(f: (buff: Buff<T>, target: Buff<T>) => boolean | undefined){this._interaction = f}

    protected _start: ((buff: Buff<T>) => void)
    protected _period: ((buff: Buff<T>) => void)
    protected _cancel: ((buff: Buff<T>) => void)
    protected _finish: ((buff: Buff<T>) => void)
    protected _condition: ((buff: Buff<T>) => boolean)
    protected _interaction: ((buff: Buff<T>, target: Buff<T>) => boolean | undefined)
}