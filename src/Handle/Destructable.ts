import { getFilePath, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

let __path__ = Macro(getFilePath())

export class hDestructable extends Handle<jdestructable> {
    constructor(id: number, x: number, y:number, z: number, a: number,
                size: number, variation: number){
        super(CreateDestructableZ(id, x, y, z, a, size, variation))
    }
    static get(id: jdestructable | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'destructable'){
            Log.err('got wrong type of handle.',
                    __path__, hDestructable, 2)
        }
        return instance as hDestructable
    }

    get x(){return GetDestructableX(this.handle)}
    get y(){return GetDestructableY(this.handle)}

    destroy(){
        RemoveDestructable(this.handle)
        super.destroy()
    }
}