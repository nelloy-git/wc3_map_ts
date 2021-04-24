import { Vec2, Vec3 } from '../Math'
import { Color, log } from '../Utils'
import { Pixel, PixelList } from "./Pixel";

export class Arc<T extends Pixel> {
    constructor(pixels: PixelList<T>, step: number = 8, z: number = 0){
        this.__c = new Vec2(0, 0)
        this.__r = 0
        this.__a1 = 0
        this.__a2 = 0
        this.__z = 0

        this.__step = step
        this.__in_use = 0
        this.__pixels = pixels

        this.z = z
    }

    get center(){return this.__c.copy()}
    set center(v: Vec2){
        this.__c = v.copy()
        this.__updPos()
    }

    get range(){return this.__r}
    set range(r: number){
        this.__r = r
        this.__updPos()
    }

    get angle1(){return this.__a1}
    set angle1(a1: number){
        this.__a1 = a1
        this.__updPos()
    }

    get angle2(){return this.__a2}
    set angle2(a2: number){
        this.__a2 = a2
        this.__updPos()
    }

    setPolarPos(center: Vec2, range: number,
                angle1: number, angle2: number){
        this.__c = center.copy()
        this.__r = range
        this.__a1 = angle1
        this.__a2 = angle2

        this.__updPos()
    }

    get z(){return this.__z}
    set z(z: number){
        this.__z = z
        for (let pixel of this.__pixels){
            let v = pixel.pos
            v.z = z
            pixel.pos = v
        }
    }
    
    get color(){return this._color.copy()}
    set color(color: Color){
        this._color = color.copy()
        for (let pixel of this.__pixels){
            pixel.color = color
        }
    }

    get visible(){return this._visible}
    set visible(flag: boolean){
        this._visible = flag
        for (let i = 0; i < math.min(this.__in_use, this.__pixels.length); i++){
            this.__pixels[i].visible = flag
        }
    }

    toString(){
        return Arc.name + '<' + this.__c.toString() + ';' + this.__r.toString() + ';'
                              + this.__a1.toString() + ';' + this.__a2.toString() + '>'
    }

    destroy(){
        for (let pixel of this.__pixels){
            pixel.destroy()
        }
    }

    private __updPos(){
        let a_min = math.min(this.__a2, this.__a1)
        let a_max = math.max(this.__a2, this.__a1)
        let da = a_max - a_min
        let arc_length = this.__r * (da)

        this.__in_use = math.floor(arc_length / this.__step) + 1
        if (this.__in_use > this.__pixels.length){
            log(this.toString() + ': is not enought pixels to fill.', 'Wrn')
        }
        
        let center = new Vec3(this.__c.x, this.__c.y, this.__z)
        let step_a = da / this.__in_use
        let rly_used = math.min(this.__in_use, this.__pixels.length)

        let sin_cur = Sin(a_min)
        let cos_cur = Cos(a_min)
        let sin_step = Sin(step_a)
        let cos_step = Cos(step_a)

        let i = 0
        for (let a = a_min; a < a_max; a += step_a){
            let pixel = this.__pixels[i++]

            pixel.visible = this._visible
            pixel.pos = new Vec3(cos_cur, sin_cur, 0).mult(this.__r).add(center)

            sin_cur = this.sinSum(sin_cur, cos_cur, sin_step, cos_step)
            cos_cur = this.cosSum(sin_cur, cos_cur, sin_step, cos_step)
        }

        for (let i = rly_used; i < this.__pixels.length; i++){
            this.__pixels[i].visible = false
        }
    }

    // sin(a + b) = sin(a) * cos(b) + cos(a) * sin(b)
    private sinSum(sin_a: number, cos_a: number, sin_b: number, cos_b: number){
        return sin_a * cos_b + cos_a * sin_b
    }

    // cos(a + b) = cos(a) * cos(b) - sin(a) * sin(b)
    private cosSum(sin_a: number, cos_a: number, sin_b: number, cos_b: number){
        return cos_a * cos_b - sin_a * sin_b
    }

    private __c: Vec2
    private __r: number
    private __a1: number
    private __a2: number
    private __z: number

    private __step: number
    private __in_use: number
    private __pixels: PixelList<T>

    private _color = new Color()
    private _visible = true
}