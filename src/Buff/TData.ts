import type { Buff } from './Buff'

export class TData<T> {
    constructor(){
        this._name = () => {return 'Noname'}
        this._icon = () => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
        this._tooltip = () => {return 'Notooltip'}
        this._add_duration = () => {return false}
    }

    get name(){return this._name}
    set name(f: (buff: Buff<T>) => string){this._name = f}

    get icon(){return this._icon}
    set icon(f: (buff: Buff<T>) => string){this._icon = f}

    get tooltip(){return this._tooltip}
    set tooltip(f: (buff: Buff<T>) => string){this._tooltip = f}

    get add_duration(){return this._add_duration}
    set add_duration(f: (buff: Buff<T>, base: Buff<T>) => boolean){this._add_duration = f}

    protected _name: ((buff: Buff<T>) => string)
    protected _icon: ((buff: Buff<T>) => string)
    protected _tooltip: ((buff: Buff<T>) => string)
    protected _add_duration: ((buff: Buff<T>, base: Buff<T>) => boolean)
}