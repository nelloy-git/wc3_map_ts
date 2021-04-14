import { Vec2 } from "./Vec2"

const LBORD = '['
const RBORD = ']'
const SEP = ','

export class Vec3 {
    constructor(x: number, y: number, z: number){
        this.__x = x
        this.__y = y
        this.__z = z
        this.__length = 0
        this.__length_actual = false
    }

    static fromVec2(v: Vec2, z: number){
        return new Vec3(v.x, v.y, z)
    }

    static fromString(s: string){
        if (s.charAt(0) != LBORD || s.charAt(s.length - 1) != RBORD){
            return undefined
        }

        s = s.slice(1, s.length - 1)
        let s_list = s.split(SEP)
        if (s_list.length != 3){
            return undefined
        }

        let x = parseFloat(s_list[0])
        let y = parseFloat(s_list[1])
        let z = parseFloat(s_list[1])

        return new Vec3(x, y, z)
    }

    copy(){
        return new Vec3(this.__x, this.__y, this.__z)
    }

    add(other: Vec3){
        return new Vec3(this.__x + other.__x,
                        this.__y + other.__y,
                        this.__z + other.__z)
    }

    sub(other: Vec3){
        return new Vec3(this.__x - other.__x,
                        this.__y - other.__y,
                        this.__z - other.__z)
    }

    mult(k: number){
        return new Vec3(k * this.__x, k * this.__y, k * this.__z)
    }

    toString(){
        return LBORD + this.__x.toString() + SEP + this.__y.toString() + SEP + this.__z.toString() + RBORD
    }

    get length(){
        if (!this.__length_actual){
            this.__length = SquareRoot(this.__x * this.__x +
                                       this.__y * this.__y +
                                       this.__z * this.__z)
            this.__length_actual = true
        }
        return this.__length
    }

    get norm(){
        return this.mult(1 / this.length)
    }

    get x(){return this.__x}
    set x(x: number){
        this.__length_actual = false
        this.__x = x
    }

    get y(){return this.__y}
    set y(y: number){
        this.__length_actual = false
        this.__y = y
    }

    get z(){return this.__z}
    set z(z: number){
        this.__length_actual = false
        this.__z = z
    }

    private __x: number
    private __y: number
    private __z: number
    
    private __length_actual: boolean
    private __length: number
}