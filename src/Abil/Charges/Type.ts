import type { Abil, TargetType } from '../Abil'

export class TCharges<T extends TargetType[]> {
    constructor(){
        this._use = () => {return 1}
        this._max = () => {return 1}
        this._cd = () => {return 5}
    }

    get use(){return this._use}
    set use(f: (abil: Abil<T>)=> number){this._use = f}

    get max(){return this._max}
    set max(f: (abil: Abil<T>)=> number){this._max = f}

    get cd(){return this._cd}
    set cd(f: (abil: Abil<T>)=> number){this._cd = f}

    protected _use: ((abil: Abil<T>) => number)
    protected _max: ((abil: Abil<T>) => number)
    protected _cd: ((abil: Abil<T>) => number)
}
