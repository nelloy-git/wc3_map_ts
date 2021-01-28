import { Color, Log } from '../Utils'
import { Pixel, PixelList } from "./Pixel";


export class Arc<T extends Pixel> {
    constructor(pixels: PixelList<T>,
                pixel_step?: number){
        this._pixels = pixels
        this._step = pixel_step ? pixel_step : 8
        this._in_use = 0
    }

    public setPolarPos(cx: number, cy: number, r: number, a1: number, a2: number){
        this._cx = cx
        this._cy = cy
        this._r = r
        this._a1 = a1
        this._a2 = a2

        this.update()
    }

    public get cx(){return this._cx}
    public get cy(){return this._cy}
    public get r(){return this._r}
    public get a1(){return this._a1}
    public get a2(){return this._a2}

    public get z(){return this._z}
    public set z(z: number){
        this._z = z
        for (let pixel of this._pixels){
            pixel.z = z
        }
    }
    
    public get color(){return new Color(this._color)}
    public set color(color: Color){
        this._color = new Color(color)
        for (let pixel of this._pixels){
            pixel.color = color
        }
    }

    public get visible(){return this._visible}
    public set visible(flag: boolean){
        this._visible = flag
        for (let i = 0; i < math.min(this._in_use, this._pixels.length); i++){
            this._pixels[i].visible = flag
        }
    }

    public destroy(){
        for (let pixel of this._pixels){
            pixel.destroy()
        }
    }

    private update(){
        let da = math.max(this._a2, this._a1) - math.min(this._a2, this._a1)
        let arc_length = this._r * (da)

        this._in_use = math.floor(arc_length / this._step) + 1
        if (this._in_use > this._pixels.length){
            Log.wrn(Arc.name + 
                    ': is not enought pixels to fill arc.')
        }

        let cx = this._cx
        let cy = this._cy
        let r = this._r
        let a = math.min(this._a2, this._a1)
        let step_a = da / this._in_use
        let rly_used = math.min(this._in_use, this._pixels.length)
        for (let i = 0; i < rly_used; i++){
            let pixel = this._pixels[i]
            pixel.visible = this._visible
            pixel.x = cx + r * Cos(a)
            pixel.y = cy + r * Sin(a)
            a += step_a
        }

        for (let i = rly_used; i < this._pixels.length; i++){
            this._pixels[i].visible = false
        }
    }

    private _cx: number = 0
    private _cy: number = 0
    private _r: number = 0
    private _a1: number = 0
    private _a2: number = 0
    private _z: number = 0

    private _step: number
    private _in_use: number
    private _pixels: PixelList<T>

    private _color = new Color(1, 1, 1, 1)
    // private _render_always = true
    private _visible = true
}