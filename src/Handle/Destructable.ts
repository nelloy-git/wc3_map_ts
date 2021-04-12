import { getFilePath, Log, Vec3, wcType } from "../Utils";
import { Handle } from "./Handle";

let __path__ = Macro(getFilePath())

export class hDestructable extends Handle<jdestructable> {

    constructor(id: number, pos: Vec3, size: number,
                angle: number, variation: number){

        super(CreateDestructableZ(id,
                                  pos.x, pos.y, pos.z,
                                  angle, size, variation))

        this.pos = pos.copy()
        this.size = size
        this.angle = angle
        this.variation = variation
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

    destroy(){
        RemoveDestructable(this.handle)
        super.destroy()
    }

    readonly pos: Vec3
    readonly size: number
    readonly angle: number
    readonly variation: number
}