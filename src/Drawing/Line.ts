import { hImage } from '../Handle';
import { Color, Log} from '../Utils'
import { Pixel, PixelList } from "./Pixel";

export class Line<T extends Pixel> {
    constructor(pixels: PixelList<T>, step?: number){
        this._step = step ? step : 8
        this._in_use = 0
        this._pixels = pixels
    }

    setPos(x1: number, y1: number, x2: number, y2: number){
        this._x1 = x1
        this._y1 = y1
        this._x2 = x2
        this._y2 = y2

        let dx = x2 - x1
        let dy = y2 - y1
        this._length = SquareRoot(dx * dx + dy * dy)
        this._angle = Atan2(dy, dx)

        this.update()
    }

    setPolarPos(cx: number, cy: number, r1: number, a1: number, r2: number, a2: number){
        this._x1 = cx + r1 * Cos(a1)
        this._y1 = cy + r1 * Sin(a1)
        this._x2 = cx + r2 * Cos(a2)
        this._y2 = cy + r2 * Sin(a2)

        let dx = this._x2 - this._x1
        let dy = this._y2 - this._y1
        this._length = SquareRoot(dx * dx + dy * dy)
        this._angle = Atan2(dy, dx)

        this.update()
    }

    get x1(){return this._x1}
    get y1(){return this._y1}
    get x2(){return this._x2}
    get y2(){return this._y2}
    get length(){return this._length}
    get angle(){return this._angle}

    public get z(){return this._z}
    public set z(z: number){
        this._z = z
        for (let pixel of this._pixels){
            pixel.z = z
        }
    }
    
    get color(){return new Color(this._color)}
    set color(color: Color){
        this._color = new Color(color)
        for (let pixel of this._pixels){
            pixel.color = color
        }
    }

    get visible(){return this._visible}
    set visible(flag: boolean){
        this._visible = flag
        for (let i = 0; i < math.min(this._in_use, this._pixels.length); i++){
            this._pixels[i].visible = flag
        }
        for (let i = math.min(this._in_use, this._pixels.length); i < math.max(this._in_use, this._pixels.length); i++){
            this._pixels[i].visible = false
        }
    }

    destroy(){
        for (let pixel of this._pixels){
            pixel.destroy()
        }
    }

    private update(){
        this._in_use = math.floor(this._length / this._step) + 1
        if (this._in_use > this._pixels.length){
            Log.wrn(Line.name + 
                    ': is not enought pixels to fill line.')
        }

        let x = this._x1
        let y = this._y1
        let step_x = this._step * Cos(this._angle)
        let step_y = this._step * Sin(this._angle)
        let rly_used = math.min(this._in_use, this._pixels.length)

        for (let i = 0; i < rly_used; i++){
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

    private _x1: number = 0
    private _y1: number = 0
    private _x2: number = 0
    private _y2: number = 0
    private _length: number = 0
    private _angle: number = 0
    private _z: number = 0

    private _step: number
    private _in_use: number
    private _pixels: PixelList<T>

    private _color = new Color(1, 1, 1, 1)
    // private _render_always = true
    private _visible = true
}