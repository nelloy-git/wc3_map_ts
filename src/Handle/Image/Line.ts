import { Color, Log} from '../../Utils'
import { Pixel } from "./Pixel";

export class Line {
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

    public setPos(x1: number, y1: number, x2: number, y2: number){
        this._x1 = x1
        this._y1 = y1
        this._x2 = x2
        this._y2 = y2

        let dx = x2 - x1
        let dy = y2 - y1
        this._length = math.sqrt(dx * dx + dy * dy)
        this._angle = math.atan2(dy, dx)

        this.update()
    }

    public setPolarPos(x1: number, y1: number, length: number, angle: number){
        this._x1 = x1
        this._y1 = y1
        this._x2 = x1 + length * Cos(angle)
        this._y2 = y1 + length * Sin(angle)
        this._length = length
        this._angle = angle

        this.update()
    }

    public get x1(){return this._x1}
    public get y1(){return this._y1}
    public get x2(){return this._x2}
    public get y2(){return this._y2}
    public get length(){return this._length}
    public get angle(){return this._angle}
    
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
        this._in_use = math.floor(this._length / this._step) + 1
        if (this._in_use > this._pixels.length){
            Log.wrn(Line.toString() + 
                    ': is not enought pixels to fill line.')
        }

        let x = this._x1
        let y = this._y1
        let step_x = this._step * Cos(this._angle)
        let step_y = this._step * Sin(this._angle)
        let rly_used = math.min(this._in_use, this._pixels.length)

        for (let i = 0; i < rly_used - 1; i++){
            let pixel = this._pixels[i]
            pixel.visible = this._visible
            pixel.x = x
            pixel.y = y
            x += step_x
            y += step_y
        }

        for (let i = rly_used; i < this._pixels.length; i++){
            this._pixels[i].visible = false
        }
    }

    private _x1: number = 0;
    private _y1: number = 0;
    private _x2: number = 0;
    private _y2: number = 0;
    private _length: number = 0
    private _angle: number = 0

    private _size: number;
    private _step: number;
    private _in_use: number;
    private _pixels: Pixel[];

    private _color = new Color(1, 1, 1, 1)
    private _render_always = true
    private _visible = false
}