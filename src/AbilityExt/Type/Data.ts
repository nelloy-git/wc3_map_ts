import { IFace, TargetType } from '../Ability/IFace'

export class TData<T extends TargetType[]> {

    get name(){return this._name}
    set name(f: (abil: IFace<T>)=> string){this._name = f}

    get icon(){return this._icon}
    set icon(f: (abil: IFace<T>)=> string){this._icon = f}

    get dis_icon(){return this._dis_icon}
    set dis_icon(f: (abil: IFace<T>)=> string){this._dis_icon = f}

    get tooltip(){return this._tooltip}
    set tooltip(f: (abil: IFace<T>)=> string){this._tooltip = f}

    get life_cost(){return this._life_cost}
    set life_cost(f: (abil: IFace<T>)=> number){this._life_cost = f}

    get mana_cost(){return this._mana_cost}
    set mana_cost(f: (abil: IFace<T>)=> number){this._mana_cost = f}

    get range(){return this._range}
    set range(f: (abil: IFace<T>)=> number){this._range = f}

    get area(){return this._area}
    set area(f: (abil: IFace<T>)=> number){this._area = f}

    get charges_use(){return this._charges_use}
    set charges_use(f: (abil: IFace<T>)=> number){this._charges_use = f}

    get charges_max(){return this._charges_max}
    set charges_max(f: (abil: IFace<T>)=> number){this._charges_max = f}

    get charge_cd(){return this._charge_cd}
    set charge_cd(f: (abil: IFace<T>)=> number){this._charge_cd = f}

    get is_available(){return this._is_available}
    set is_available(f: (abil: IFace<T>)=> boolean){this._is_available = f}

    get consume(){return this._consume}
    set consume(f: (abil: IFace<T>, target: T)=> boolean){this._consume = f}

    protected _name: ((abil: IFace<T>) => string) = () => {return 'undefined'}
    protected _icon: ((abil: IFace<T>) => string) = () => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
    protected _dis_icon: ((abil: IFace<T>) => string) = () => {return 'undefined'}
    protected _tooltip: ((abil: IFace<T>) => string) = () => {return ''}
    protected _life_cost: ((abil: IFace<T>) => number) = () => {return 0}
    protected _mana_cost: ((abil: IFace<T>) => number) = () => {return 0}
    protected _range: ((abil: IFace<T>) => number) = () => {return 0}
    protected _area: ((abil: IFace<T>) => number) = () => {return 0}
    protected _charges_use: ((abil: IFace<T>) => number) = () => {return 1}
    protected _charges_max: ((abil: IFace<T>) => number) = () => {return 1}
    protected _charge_cd: ((abil: IFace<T>) => number) = () => {return 5}
    protected _is_available: ((abil: IFace<T>) => boolean) = () => {return true}
    protected _consume: ((abil: IFace<T>, target: T) => boolean) = () => {return true}
}