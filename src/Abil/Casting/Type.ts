import type { Abil, TargetType} from '../Abil'

export class TCasting<T extends TargetType[]> {
    constructor(){
        this._start = ()=>{}
        this._casting = ()=>{}
        this._cancel = ()=>{}
        this._interrupt = ()=>{}
        this._finish = ()=>{}
        this._castingTime = ()=>{return 1}
        this._isTargetValid = ()=>{return true}
    }

    get start(){return this._start}
    set start(f: ((abil: Abil<T>, targ: T)=>void)){this._start = f}
    
    get casting(){return this._casting}
    set casting(f: ((abil: Abil<T>, targ: T)=>void)){this._casting = f}
    
    get cancel(){return this._cancel}
    set cancel(f: ((abil: Abil<T>, targ: T)=>void)){this._cancel = f}
    
    get interrupt(){return this._interrupt}
    set interrupt(f: ((abil: Abil<T>, targ: T)=>void)){this._interrupt = f}
    
    get finish(){return this._finish}
    set finish(f: ((abil: Abil<T>, targ: T)=>void)){this._finish = f}

    get castingTime(){return this._castingTime}
    set castingTime(f: (abil: Abil<T>, targ: T | undefined)=> number){this._castingTime = f}
    
    get isTargetValid(){return this._isTargetValid}
    set isTargetValid(f: ((abil: Abil<T>, targ: T)=>boolean)){this._isTargetValid = f}

    protected _start: (this: void, abil: Abil<T>, targ: T) => void
    protected _casting: (this: void, abil: Abil<T>, targ: T) => void
    protected _cancel: (this: void, abil: Abil<T>, targ: T) => void
    protected _interrupt: (this: void, abil: Abil<T>, targ: T) => void
    protected _finish: (this: void, abil: Abil<T>, targ: T) => void
    protected _castingTime: (this: void, abil: Abil<T>, targ: T | undefined) => number
    protected _isTargetValid: (this: void, abil: Abil<T>, targ: T) => boolean
}