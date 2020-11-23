import { Ability } from './Ability'
import { Unit } from "../Handle";
import { Log } from "../Utils";

export class Container {
    constructor(owner: Unit){
        this.owner = owner
        if (Container._owner2container.get(owner)){
            return Log.err(Container.name + 
                           ': already exists.', 2)
        }
        Container._owner2container.set(owner, this)
    }

    public get list(){return this._list}

    readonly owner: Unit;
    private _list = new Map<number, Ability>()

    private static _owner2container = new Map<Unit, Container>()
}