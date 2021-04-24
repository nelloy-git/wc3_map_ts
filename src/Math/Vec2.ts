const LBORD = '['
const RBORD = ']'
const SEP = ','

export class Vec2 {
    constructor(x: number, y: number){
        this.__x = x
        this.__y = y
        this.__length = 0
        this.__length_actual = false
        this.__angle = 0
        this.__angle_actual = false
    }

    static fromPolar(a: number, r: number){
        return new Vec2(r * Cos(a), r * Sin(a))
    }

    static fromString(s: string){
        if (s.charAt(0) != LBORD || s.charAt(s.length - 1) != RBORD){
            return undefined
        }

        s = s.slice(1, s.length - 1)
        let s_list = s.split(SEP)
        if (s_list.length != 2){
            return undefined
        }

        let x = parseFloat(s_list[0])
        let y = parseFloat(s_list[1])

        return new Vec2(x, y)
    }

    copy(){
        return new Vec2(this.__x, this.__y)
    }

    add(other: Vec2){
        return new Vec2(this.__x + other.__x, this.__y + other.__y)
    }

    sub(other: Vec2){
        return new Vec2(this.__x - other.__x, this.__y - other.__y)
    }

    mult(k: number){
        return new Vec2(k * this.__x, k * this.__y)
    }

    toString(){
        return LBORD + this.__x.toString() + SEP + this.__y.toString() + RBORD
    }

    get length(){
        if (!this.__length_actual){
            this.__length = SquareRoot(this.__x * this.__x + this.__y * this.__y)
            this.__length_actual = true
        }
        return this.__length
    }
    set length(len: number){
        let k = len / this.__length
        this.__length = len
        this.__x *= k
        this.__y *= k
    }

    /** @return [0; 2 * Pi] */
    get angle(){
        if (!this.__angle_actual){
            let a = Math.atan2(this.y, this.x)
            this.__angle = a >= 0 ? a : 2 * math.pi + a
            this.__angle_actual = true
        }
        return this.__angle
    }

    get norm(){
        return this.mult(1 / this.length)
    }

    get x(){return this.__x}
    set x(x: number){
        this.__length_actual = false
        this.__angle_actual = false
        this.__x = x
    }

    get y(){return this.__y}
    set y(y: number){
        this.__length_actual = false
        this.__angle_actual = false
        this.__y = y
    }

    private __x: number
    private __y: number
    
    private __length_actual: boolean
    private __length: number

    private __angle_actual: boolean
    private __angle: number
}