import { IFace } from '../Ability/IFace'
import { TargetType } from '../Utils'

export class TData<T extends TargetType> {

    get name(){return this._name}
    set name(f: (abil: IFace<T>)=> string){this._name = f}

    get iconNormal(){return this._iconNormal}
    set iconNormal(f: (abil: IFace<T>)=> string){this._iconNormal = f}

    get iconDisabled(){return this._iconDisabled}
    set iconDisabled(f: (abil: IFace<T>)=> string){this._iconDisabled = f}

    get tooltip(){return this._tooltip}
    set tooltip(f: (abil: IFace<T>)=> string){this._tooltip = f}

    get lifeCost(){return this._lifeCost}
    set lifeCost(f: (abil: IFace<T>)=> number){this._lifeCost = f}

    get manaCost(){return this._manaCost}
    set manaCost(f: (abil: IFace<T>)=> number){this._manaCost = f}

    get range(){return this._range}
    set range(f: (abil: IFace<T>)=> number){this._range = f}

    get area(){return this._area}
    set area(f: (abil: IFace<T>)=> number){this._area = f}

    get chargeUsed(){return this._chargeUsed}
    set chargeUsed(f: (abil: IFace<T>)=> number){this._chargeUsed = f}

    get chargeMax(){return this._chargeMax}
    set chargeMax(f: (abil: IFace<T>)=> number){this._chargeMax = f}

    get chargeCooldown(){return this._chargeCooldown}
    set chargeCooldown(f: (abil: IFace<T>)=> number){this._chargeCooldown = f}

    get castingTime(){return this._castingTime}
    set castingTime(f: (abil: IFace<T>)=> number){this._castingTime = f}

    get isAvailable(){return this._isAvailable}
    set isAvailable(f: (abil: IFace<T>)=> boolean){this._isAvailable = f}

    get consume(){return this._consume}
    set consume(f: (abil: IFace<T>, target: T)=> boolean){this._consume = f}

    private _name: ((abil: IFace<T>) => string) = () => {return ''}
    private _iconNormal: ((abil: IFace<T>) => string) = () => {return ''}
    private _iconDisabled: ((abil: IFace<T>) => string) = () => {return ''}
    private _tooltip: ((abil: IFace<T>) => string) = () => {return ''}
    private _lifeCost: ((abil: IFace<T>) => number) = () => {return 0}
    private _manaCost: ((abil: IFace<T>) => number) = () => {return 0}
    private _range: ((abil: IFace<T>) => number) = () => {return 0}
    private _area: ((abil: IFace<T>) => number) = () => {return 0}
    private _chargeUsed: ((abil: IFace<T>) => number) = () => {return 1}
    private _chargeMax: ((abil: IFace<T>) => number) = () => {return 1}
    private _chargeCooldown: ((abil: IFace<T>) => number) = () => {return 5}
    private _castingTime: ((abil: IFace<T>) => number) = () => {return 2}
    private _isAvailable: ((abil: IFace<T>) => boolean) = () => {return true}
    private _consume: ((abil: IFace<T>, target: T) => boolean) = () => {return true}
}