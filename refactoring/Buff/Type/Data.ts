import { IFace } from "../Buff/IFace";

export class TData<T> {

    get name(){return this.__name}
    set name(f: (buff: IFace<T>) => string){this.__name = f}

    get icon(){return this.__icon}
    set icon(f: (buff: IFace<T>) => string){this.__icon = f}

    get tooltip(){return this.__tooltip}
    set tooltip(f: (buff: IFace<T>) => string){this.__tooltip = f}

    get stackable(){return this.__stackable}
    set stackable(f: () => boolean){this.__stackable = f}

    get add_duration(){return this.__add_duration}
    set add_duration(f: () => boolean){this.__add_duration = f}

    private __name: ((buff: IFace<T>) => string) = () => {return 'undefined'}
    private __icon: ((buff: IFace<T>) => string) = () => {return 'ReplaceableTextures\\WorldEditUI\\DoodadPlaceholder.blp'}
    private __tooltip: ((buff: IFace<T>) => string) = () => {return 'undefined'}
    private __stackable: (() => boolean) = () => {return false}
    private __add_duration: (() => boolean) = () => {return false}
}