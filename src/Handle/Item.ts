import { Log, wcType } from "../Utils";
import { Handle } from "./Handle";

export class hItem extends Handle<jitem> {
    constructor(id: number, x: number, y: number){
        super(CreateItem(id, x, y))

        this._x = x
        this._y = y
    }

    public static get(id: jitem | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'item'){
            return Log.err(hItem.name + 
                           ': got wrong type of handle.')
        }
        return instance as hItem
    }

    get pos(){return [this.x, this.y]}
    set pos(pos: [x: number, y: number]){
        this._x = pos[0]
        this._y = pos[1]
        SetItemPosition(this.handle, this._x, this._y)
    }

    get x(){return GetItemX(this.handle)}
    set x(x: number){this._x = x; SetItemPosition(this.handle, this._x, this._y)}

    get y(){return GetItemY(this.handle)}
    set y(y: number){this._y = y; SetItemPosition(this.handle, this._x, this._y)}

    get visible(){return IsItemVisible(this.handle)}
    set visible(flag: boolean){SetItemVisible(this.handle, flag)}

    destroy(){
        RemoveItem(this.handle)
        super.destroy()
    }

    private _x: number
    private _y: number
}