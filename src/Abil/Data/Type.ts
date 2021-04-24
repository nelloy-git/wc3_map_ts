import type { Abil, TargetType } from '../Abil'

export class TData<T extends TargetType[]> {

    constructor(){
        this._name = () => {return 'undefined'}
        this._icon = () => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
        this._dis_icon = () => {return 'undefined'}
        this._tooltip = () => {return ''}
        this._life_cost = () => {return 0}
        this._mana_cost = () => {return 0}
        this._range = () => {return 0}
        this._area = () => {return 0}
        this._is_available = () => {return true}
        this._consume = () => {return true}
    }

    get name(){return this._name}
    set name(f: (abil: Abil<T>)=> string){this._name = f}

    get icon(){return this._icon}
    set icon(f: (abil: Abil<T>)=> string){this._icon = f}

    get dis_icon(){return this._dis_icon}
    set dis_icon(f: (abil: Abil<T>)=> string){this._dis_icon = f}

    get tooltip(){return this._tooltip}
    set tooltip(f: (abil: Abil<T>, full: boolean)=> string){this._tooltip = f}

    get life_cost(){return this._life_cost}
    set life_cost(f: (abil: Abil<T>)=> number){this._life_cost = f}

    get mana_cost(){return this._mana_cost}
    set mana_cost(f: (abil: Abil<T>)=> number){this._mana_cost = f}

    get range(){return this._range}
    set range(f: (abil: Abil<T>)=> number){this._range = f}

    get area(){return this._area}
    set area(f: (abil: Abil<T>)=> number){this._area = f}

    get is_available(){return this._is_available}
    set is_available(f: (abil: Abil<T>)=> boolean){this._is_available = f}

    get consume(){return this._consume}
    set consume(f: (abil: Abil<T>, target: T)=> boolean){this._consume = f}

    protected _name: ((abil: Abil<T>) => string)
    protected _icon: ((abil: Abil<T>) => string)
    protected _dis_icon: ((abil: Abil<T>) => string)
    protected _tooltip: ((abil: Abil<T>, full: boolean) => string)
    protected _life_cost: ((abil: Abil<T>) => number)
    protected _mana_cost: ((abil: Abil<T>) => number)
    protected _range: ((abil: Abil<T>) => number)
    protected _area: ((abil: Abil<T>) => number)
    protected _is_available: ((abil: Abil<T>) => boolean)
    protected _consume: ((abil: Abil<T>, target: T) => boolean)
}