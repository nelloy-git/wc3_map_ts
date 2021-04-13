import { Vec2 } from "../Math";
import { Handle } from "./Handle";

let __path__ = Macro(getFilePath())

export class hItem extends Handle<jitem> {
    constructor(id: number){
        super(CreateItem(id, 0, 0))
    }

    public static get(id: jitem | number){
        return Handle.get(id, 'item') as hItem | undefined
    }

    get pos(){return new Vec2(GetItemX(this.handle), GetItemY(this.handle))}
    set pos(v: Vec2){
        SetItemPosition(this.handle, v.x, v.y)
    }

    get visible(){return IsItemVisible(this.handle)}
    set visible(flag: boolean){
        SetItemVisible(this.handle, flag)
    }

    destroy(){
        RemoveItem(this.handle)
        super.destroy()
    }
}