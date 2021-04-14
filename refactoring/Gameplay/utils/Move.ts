import { Vec2 } from '../../../src/Math'
import { isPathable } from '../../../src/Utils'

export class Move {
    /** Input parameters are per loop values */
    constructor(obj: {pos: Vec2}, vel: Vec2, acc?: Vec2){
        this.obj = obj
        this.__vel = vel
        this.acc = acc
    }

    move(){
        let pos = this.obj.pos.add(this.__vel)
        if (!isPathable(pos)){
            return false
        }
        this.obj.pos = pos

        if (this.acc){
            this.__vel = this.__vel.add(this.acc)
        }
        return pos
    }

    get vel(){return this.__vel}

    readonly obj: {pos: Vec2}
    readonly acc: Vec2 | undefined

    private __vel: Vec2
}