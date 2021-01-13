import { IFace } from "../Buff/IFace";

export class TData<T> {

    get name(){return this._name}
    set name(f: (buff: IFace<T>) => string){this._name = f}

    get icon(){return this._icon}
    set icon(f: (buff: IFace<T>) => string){this._icon = f}

    get tooltip(){return this._tooltip}
    set tooltip(f: (buff: IFace<T>) => string){this._tooltip = f}

    private _name: ((buff: IFace<T>) => string) = () => {return 'undefined'}
    private _icon: ((buff: IFace<T>) => string) = () => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
    private _tooltip: ((buff: IFace<T>) => string) = () => {return 'undefined'}
}