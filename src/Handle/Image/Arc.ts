import { Color, Log } from '../../Utils'
import { Pixel } from "./Pixel";

export class Arc {
    constructor(max_pixels: number,
                pixel_size?: number,
                pixel_step?: number){

        this._size = pixel_size ? pixel_size : 16
        this._step = pixel_step ? pixel_step : 8
        this._in_use = 0
        this._pixels = []
        
        for (let i = 0; i < max_pixels; i++){
            let pixel = new Pixel(this._size)
            this._pixels.push(pixel)
            pixel.renderAlways = true
            pixel.visible = false
        }
    }

    public setPolarPos(x1: number, y1: number, range: number, a1: number, a2: number){
        this._x1 = x1
        this._y1 = y1
        this._range = range
        this._a1 = a1
        this._a2 = a2

        this.update()
    }

    public get x1(){return this._x1}
    public get y1(){return this._y1}
    public get range(){return this._range}
    public get a1(){return this._a1}
    public get a2(){return this._a2}
    
    public get color(){return new Color(this._color)}
    public set color(color: Color){
        this._color = new Color(color)
        for (let pixel of this._pixels){
            pixel.color = color
        }
    }

    public get renderAlways(){return this._render_always}
    public set renderAlways(flag: boolean){
        this._render_always = flag
        for (let pixel of this._pixels){
            pixel.renderAlways = flag
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
        let da = this._a2 - this._a1
        let arc_length = this._range * (da)

        this._in_use = math.floor(arc_length / this._step) + 1
        if (this._in_use > this._pixels.length){
            Log.wrn(Arc.toString() + 
                    ': is not enought pixels to fill arc.')
        }

        let a = this.a1
        let step_a = da / this._in_use
        let rly_used = math.min(this._in_use, this._pixels.length)

        for (let i = 0; i < rly_used; i++){
            let pixel = this._pixels[i]
            pixel.visible = this._visible
            pixel.x = this._x1 + this._range * Cos(a)
            pixel.y = this._y1 + this._range * Sin(a)
            a += step_a
        }

        for (let i = rly_used; i < this._pixels.length; i++){
            this._pixels[i].visible = false
        }
    }

    private _x1: number = 0;
    private _y1: number = 0;
    private _range: number = 0;
    private _a1: number = 0;
    private _a2: number = 0;

    private _size: number;
    private _step: number;
    private _in_use: number;
    private _pixels: Pixel[];

    private _color = new Color(1, 1, 1, 1)
    private _render_always = true
    private _visible = false
}