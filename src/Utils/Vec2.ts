const LBORD = '['
const RBORD = ']'
const SEP = ','

export class Vec2 {
    constructor(x: number, y: number){
        this.x = x
        this.y = y
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
        return new Vec2(this.x, this.y)
    }

    add(other: Vec2){
        return new Vec2(this.x + other.x, this.y + other.y)
    }

    mult(k: number){
        return new Vec2(k * this.x, k * this.y)
    }

    toString(){
        return LBORD + this.x.toString() + SEP + this.y.toString() + RBORD
    }

    x: number
    y: number
}