import type { Buff } from '../Buff'

export class TData<T> {
    constructor(){
        this._name = () => {return 'undefined'}
        this._icon = () => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
        this._tooltip = () => {return 'undefined'}
        this._stackable = () => {return false}
        this._add_duration = () => {return false}
    }

    get name(){return this._name}
    set name(f: (buff: Buff<T>) => string){this._name = f}

    get icon(){return this._icon}
    set icon(f: (buff: Buff<T>) => string){this._icon = f}

    get tooltip(){return this._tooltip}
    set tooltip(f: (buff: Buff<T>) => string){this._tooltip = f}

    get stackable(){return this._stackable}
    set stackable(f: (buff: Buff<T>, other: Buff<T>) => boolean){this._stackable = f}

    get add_duration(){return this._add_duration}
    set add_duration(f: (buff: Buff<T>, other: Buff<T>) => boolean){this._add_duration = f}

    protected _name: ((buff: Buff<T>) => string)
    protected _icon: ((buff: Buff<T>) => string)
    protected _tooltip: ((buff: Buff<T>) => string)
    protected _stackable: ((buff: Buff<T>, other: Buff<T>) => boolean)
    protected _add_duration: ((buff: Buff<T>, other: Buff<T>) => boolean)
}