const LBORD = '['
const RBORD = ']'
const SEP = ','

export class Vec3 {
    constructor(x: number, y: number, z: number){
        this.x = x
        this.y = y
        this.z = z
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

    add(other: Vec3){
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z)
    }

    mult(k: number){
        return new Vec3(k * this.x, k * this.y, k * this.z)
    }

    toString(){
        return LBORD + this.x.toString() + SEP + this.y.toString() + SEP + this.z.toString() + RBORD
    }

    x: number
    y: number
    z: number
}