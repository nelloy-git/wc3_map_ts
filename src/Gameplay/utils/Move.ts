import { isWalkable, Vec2 } from '../../Utils'

export class Move {
    /** Input parameters are per loop values */
    constructor(obj: {pos: Vec2}, vel: Vec2, acc?: Vec2){
        this.obj = obj
        this.vel = vel
        this.acc = acc
    }

    move(){
        let pos = this.obj.pos.add(this.vel)
        if (!isWalkable(pos)){
            return false
        }
        this.obj.pos = pos

        if (this.acc){
            this.vel.add(this.acc)
        }
        return pos
    }

    readonly obj: {pos: Vec2}
    readonly vel: Vec2
    readonly acc: Vec2 | undefined
}