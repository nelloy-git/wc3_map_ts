import { Vec2, Vec3 } from '../Math'
import { Color, log } from '../Utils'
import { Pixel, PixelList } from "./Pixel";

export class Line<T extends Pixel> {
    constructor(pixels: PixelList<T>, step: number = 8, z: number = 0){
        this.__p1 = new Vec2(0, 0)
        this.__p2 = new Vec2(0, 0)
        this.__length = 0
        this.__angle = 0
        this.__z = 0

        this.__step = step
        this.__in_use = 0
        this.__pixels = pixels

        this.z = z
    }

    get point1(){return this.__p1.copy()}
    set point1(v: Vec2){
        this.__p1 = v.copy()
        this.__updPos()
    }

    get point2(){return this.__p2.copy()}
    set point2(v: Vec2){
        this.__p2 = v.copy()
        this.__updPos()
    }

    setPos(p1: Vec2, p2: Vec2){
        this.__p1 = p1.copy()
        this.__p2 = p2.copy()
        this.__updPos()
    }

    setPolarPos(c: Vec2, r1: number, a1: number, r2: number, a2: number){
        this.__p1 = c.add(new Vec2(r1 * Cos(a1), r1 * Sin(a1)))
        this.__p2 = c.add(new Vec2(r2 * Cos(a2), r2 * Sin(a2)))
        this.__updPos()
    }

    get length(){return this.__length}
    get angle(){return this.__angle}

    get z(){return this.__z}
    set z(z: number){
        this.__z = z
        for (let pixel of this.__pixels){
            let v = pixel.pos
            v.z = z
            pixel.pos = v
        }
    }
    
    get color(){return this.__color.copy()}
    set color(color: Color){
        this.__color = this.__color.copy()
        for (let pixel of this.__pixels){
            pixel.color = color
        }
    }

    get visible(){return this.__visible}
    set visible(flag: boolean){
        this.__visible = flag
        for (let i = 0; i < math.min(this.__in_use, this.__pixels.length); i++){
            this.__pixels[i].visible = flag
        }
        for (let i = math.min(this.__in_use, this.__pixels.length); i < math.max(this.__in_use, this.__pixels.length); i++){
            this.__pixels[i].visible = false
        }
    }

    toString(){
        return Line.name + '<' + this.__p1.toString + ';' + this.__p2.toString() + '>'
    }

    destroy(){
        for (let pixel of this.__pixels){
            pixel.destroy()
        }
    }

    private __updPos(){
        let delta = this.__p2.sub(this.__p1)
        this.__length = delta.length
        this.__angle = delta.angle

        this.__in_use = math.floor(this.__length / this.__step) + 1
        if (this.__in_use > this.__pixels.length){
            log(this.toString + ': is not enought pixels to fill line.')
        }

        let start = new Vec3(this.__p1.x, this.__p2.y, this.__z)
        let step = new Vec3(Cos(this.__angle), Sin(this.__angle), 0).mult(this.__step)

        let rly_used = math.min(this.__in_use, this.__pixels.length)
        for (let i = 0; i < rly_used; i++){
            let pixel = this.__pixels[i]
            pixel.visible = this.__visible
            pixel.pos = start.add(step.mult(i))
        }

        for (let i = rly_used; i < this.__pixels.length; i++){
            this.__pixels[i].visible = false
        }
    }

    private __p1: Vec2
    private __p2: Vec2
    private __length: number
    private __angle: number
    private __z: number

    private __step: number
    private __in_use: number
    private __pixels: PixelList<T>

    private __color = new Color(1, 1, 1, 1)
    private __visible = true
}