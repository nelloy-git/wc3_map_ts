import { hImage } from '../../Handle'
import { Import } from '../../Utils'

import * as AshenvaleDirt from './SD/Ashenvale/Dirt'
export {AshenvaleDirt}

export class TerrainTile {
    constructor(top: Import, bot: Import){
        this.__bot = new hImage(bot.dst, 264, 264, 0, 0)
        this.__bot.constantHeight = false
        this.__bot.renderAlways = true
        this.__bot.visible = true

        // this.__top = new hImage(top.dst, 255.9, 255.9, 0, 0)
        // this.__top.constantHeight = false
        // this.__top.renderAlways = true
        // this.__top.visible = true
    }

    get x(){return this.__x}
    set x(x: number){
        this.__x = x
        this.__bot.x = x - 64
        // this.__top.x = x - 64
    }

    get y(){return this.__y}
    set y(y: number){
        this.__y = y
        this.__bot.y = y - 64
        // this.__top.y = y - 64
    }

    private __x = 0
    private __y = 0
    // private __uber: jubersplat
    // private __top: hImage
    private __bot: hImage
}