import { IFace } from '../Ability/IFace'
import { TargetType } from '../Utils'

export class TCasting<T extends TargetType> {

    get start(){return this._start}
    set start(f: ((abil: IFace<T>, targ: T)=>void)){this._start = f}
    
    get casting(){return this._casting}
    set casting(f: ((abil: IFace<T>, targ: T)=>void)){this._casting = f}
    
    get cancel(){return this._cancel}
    set cancel(f: ((abil: IFace<T>, targ: T)=>void)){this._cancel = f}
    
    get interrupt(){return this._interrupt}
    set interrupt(f: ((abil: IFace<T>, targ: T)=>void)){this._interrupt = f}
    
    get finish(){return this._finish}
    set finish(f: ((abil: IFace<T>, targ: T)=>void)){this._finish = f}

    get castingTime(){return this._castingTime}
    set castingTime(f: (abil: IFace<T>, targ: T | undefined)=> number){this._castingTime = f}
    
    get isTargetValid(){return this._isTargetValid}
    set isTargetValid(f: ((abil: IFace<T>, targ: T)=>boolean)){this._isTargetValid = f}

    private _start: (abil: IFace<T>, targ: T)=>void = ()=>{}
    private _casting: (abil: IFace<T>, targ: T)=>void = ()=>{}
    private _cancel: (abil: IFace<T>, targ: T)=>void = ()=>{}
    private _interrupt: (abil: IFace<T>, targ: T)=>void = ()=>{}
    private _finish: (abil: IFace<T>, targ: T)=>void = ()=>{}
    private _castingTime: (abil: IFace<T>, targ: T | undefined)=>number = ()=>{return 1}
    private _isTargetValid: (abil: IFace<T>, targ: T)=>boolean = ()=>{return true}
}