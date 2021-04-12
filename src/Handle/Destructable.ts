import { Vec3 } from "../Math";
import { Handle } from "./Handle";

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
        return Handle.get(id, 'destructable') as hDestructable | undefined
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