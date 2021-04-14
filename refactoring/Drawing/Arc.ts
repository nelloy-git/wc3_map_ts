import { Color, Log, Vec2 } from '../../src/Utils'
import { Pixel, PixelList } from "./Pixel";


export class Arc<T extends Pixel> {
    constructor(pixels: PixelList<T>,
                pixel_step: number = 8, z: number = 0){
        this.__c = new Vec2(0, 0)
        this.__r = 0
        this.__a1 = 0
        this.__a2 = 0
        this.__z = 0

        this.__pixels = pixels
        this.__step = pixel_step
        this.__in_use = 0

        if (z != 0){this.z = z}
    }

    public setPolarPos(c: Vec2, r: number, a1: number, a2: number){
        this.__c = c.copy()
        this.__r = r
        this.__a1 = a1
        this.__a2 = a2

        this._update()
    }

    public get c(){return this.__c.copy()}
    public get r(){return this.__r}
    public get a1(){return this.__a1}
    public get a2(){return this.__a2}

    public get z(){return this.__z}
    public set z(z: number){
        this.__z = z
        for (let pixel of this.__pixels){
            pixel.z = z
        }
    }
    
    public get color(){return new Color(this._color)}
    public set color(color: Color){
        this._color = new Color(color)
        for (let pixel of this.__pixels){
            pixel.color = color
        }
    }

    public get visible(){return this._visible}
    public set visible(flag: boolean){
        this._visible = flag
        for (let i = 0; i < math.min(this.__in_use, this.__pixels.length); i++){
            this.__pixels[i].visible = flag
        }
    }

    public destroy(){
        for (let pixel of this.__pixels){
            pixel.destroy()
        }
    }

    private _update(){
        let da = math.max(this.__a2, this.__a1) - math.min(this.__a2, this.__a1)
        let arc_length = this.__r * (da)

        this.__in_use = math.floor(arc_length / this.__step) + 1
        if (this.__in_use > this.__pixels.length){
            Log.wrn(Arc.name + 
                    ': is not enought pixels to fill arc.')
        }

        let c = this.__c
        let r = this.__r
        let a = math.min(this.__a2, this.__a1)
        let step_a = da / this.__in_use
        let rly_used = math.min(this.__in_use, this.__pixels.length)
        for (let i = 0; i < rly_used; i++){
            let pixel = this.__pixels[i]
            pixel.visible = this._visible
            pixel.x = c.x + r * Cos(a)
            pixel.y = c.y + r * Sin(a)
            a += step_a
        }

        for (let i = rly_used; i < this.__pixels.length; i++){
            this.__pixels[i].visible = false
        }
    }

    private __c: Vec2
    private __r: number
    private __a1: number
    private __a2: number
    private __z: number

    private __step: number
    private __in_use: number
    private __pixels: PixelList<T>

    private _color = new Color(1, 1, 1, 1)
    // private _render_always = true
    private _visible = true
}