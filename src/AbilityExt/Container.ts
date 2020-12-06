import { Ability } from './Ability'
import { hUnit } from "../Handle";
import { Log } from "../Utils";

export class Container {
    constructor(owner: hUnit){
        this.owner = owner
        if (Container._owner2container.get(owner)){
            return Log.err(Container.name + 
                           ': already exists.', 2)
        }
        Container._owner2container.set(owner, this)
    }

    public get list(){return this._list}

    readonly owner: hUnit;
    private _list = new Map<number, Ability>()

    private static _owner2container = new Map<hUnit, Container>()
}