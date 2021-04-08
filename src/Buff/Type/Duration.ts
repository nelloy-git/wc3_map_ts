import { IFace } from "../Buff/IFace";

export class TDuration<T> {

    get start(){return this.__start}
    set start(f: ((buff: IFace<T>) => void)){this.__start = f}
    
    get period(){return this.__period}
    set period(f: ((buff: IFace<T>) => void)){this.__period = f}
    
    get cancel(){return this.__cancel}
    set cancel(f: ((buff: IFace<T>) => void)){this.__cancel = f}
    
    get finish(){return this.__finish}
    set finish(f: ((buff: IFace<T>) => void)){this.__finish = f}
    
    get condition(){return this.__condition}
    set condition(f: ((buff: IFace<T>) => boolean)){this.__condition = f}

    get addStack(){return this.__addStack}
    set addStack(f: ((buff: IFace<T>, other: IFace<T>) => void)){this.__addStack = f}

    private __start: (buff: IFace<T>) => void = ()=>{}
    private __period: (buff: IFace<T>) => void = ()=>{}
    private __cancel: (buff: IFace<T>) => void = ()=>{}
    private __finish: (buff: IFace<T>) => void = ()=>{}
    private __condition: (buff: IFace<T>) => boolean = ()=>{return true}
    private __addStack: (buff: IFace<T>, other: IFace<T>) => void = ()=>{}
}