import { hImage } from '../Handle';
import { Color, Log, Vec2 } from '../Utils'
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

        if (z != 0){this.z = z}
    }

    setPos(p1: Vec2, p2: Vec2){
        this.__p1 = p1.copy()
        this.__p2 = p2.copy()

        let delta = p2.sub(p1)
        this.__length = delta.length
        this.__angle = delta.angle

        this._update()
    }

    setPolarPos(c: Vec2, r1: number, a1: number, r2: number, a2: number){
        this.__p1 = c.add(new Vec2(r1 * Cos(a1), r1 * Sin(a1)))
        this.__p2 = c.add(new Vec2(r2 * Cos(a2), r2 * Sin(a2)))

        let delta = this.__p2.sub(this.__p1)
        this.__length = delta.length
        this.__angle = delta.angle

        this._update()
    }

    get p1(){return this.__p1.copy()}
    get p2(){return this.__p2.copy()}
    get length(){return this.__length}
    get angle(){return this.__angle}

    public get z(){return this.__z}
    public set z(z: number){
        this.__z = z
        for (let pixel of this.__pixels){
            pixel.z = z
        }
    }
    
    get color(){return new Color(this.__color)}
    set color(color: Color){
        this.__color = new Color(color)
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

    destroy(){
        for (let pixel of this.__pixels){
            pixel.destroy()
        }
    }

    private _update(){
        this.__in_use = math.floor(this.__length / this.__step) + 1
        if (this.__in_use > this.__pixels.length){
            Log.wrn(Line.name + 
                    ': is not enought pixels to fill line.')
        }

        let step = new Vec2(Cos(this.__angle), Sin(this.__angle)).mult(this.__step)
        let rly_used = math.min(this.__in_use, this.__pixels.length)
        for (let i = 0; i < rly_used; i++){
            let pixel = this.__pixels[i]
            pixel.visible = this.__visible
            pixel.x = this.__p1.x + i * step.x
            pixel.y = this.__p1.y + i * step.y
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