import { IFace, TargetType } from '../Ability/IFace'

export class TData<T extends TargetType[]> {

    get name(){return this.__name}
    set name(f: (abil: IFace<T>)=> string){this.__name = f}

    get iconNormal(){return this.__iconNormal}
    set iconNormal(f: (abil: IFace<T>)=> string){this.__iconNormal = f}

    get iconDisabled(){return this.__iconDisabled}
    set iconDisabled(f: (abil: IFace<T>)=> string){this.__iconDisabled = f}

    get tooltip(){return this.__tooltip}
    set tooltip(f: (abil: IFace<T>)=> string){this.__tooltip = f}

    get lifeCost(){return this.__lifeCost}
    set lifeCost(f: (abil: IFace<T>)=> number){this.__lifeCost = f}

    get manaCost(){return this.__manaCost}
    set manaCost(f: (abil: IFace<T>)=> number){this.__manaCost = f}

    get range(){return this.__range}
    set range(f: (abil: IFace<T>)=> number){this.__range = f}

    get area(){return this.__area}
    set area(f: (abil: IFace<T>)=> number){this.__area = f}

    get chargeUsed(){return this.__chargeUsed}
    set chargeUsed(f: (abil: IFace<T>)=> number){this.__chargeUsed = f}

    get chargeMax(){return this.__chargeMax}
    set chargeMax(f: (abil: IFace<T>)=> number){this.__chargeMax = f}

    get chargeCooldown(){return this.__chargeCooldown}
    set chargeCooldown(f: (abil: IFace<T>)=> number){this.__chargeCooldown = f}

    get isAvailable(){return this.__isAvailable}
    set isAvailable(f: (abil: IFace<T>)=> boolean){this.__isAvailable = f}

    get consume(){return this.__consume}
    set consume(f: (abil: IFace<T>, target: T)=> boolean){this.__consume = f}

    private __name: ((abil: IFace<T>) => string) = () => {return 'undefined'}
    private __iconNormal: ((abil: IFace<T>) => string) = () => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
    private __iconDisabled: ((abil: IFace<T>) => string) = () => {return 'undefined'}
    private __tooltip: ((abil: IFace<T>) => string) = () => {return ''}
    private __lifeCost: ((abil: IFace<T>) => number) = () => {return 0}
    private __manaCost: ((abil: IFace<T>) => number) = () => {return 0}
    private __range: ((abil: IFace<T>) => number) = () => {return 0}
    private __area: ((abil: IFace<T>) => number) = () => {return 0}
    private __chargeUsed: ((abil: IFace<T>) => number) = () => {return 1}
    private __chargeMax: ((abil: IFace<T>) => number) = () => {return 1}
    private __chargeCooldown: ((abil: IFace<T>) => number) = () => {return 5}
    private __isAvailable: ((abil: IFace<T>) => boolean) = () => {return true}
    private __consume: ((abil: IFace<T>, target: T) => boolean) = () => {return true}
}