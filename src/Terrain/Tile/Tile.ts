import { hImage } from '../../Handle'
import { Import } from '../../Utils'

import * as AshenvaleDirt from './SD/Ashenvale/Dirt'
export {AshenvaleDirt}

export class TerrainTile {
    constructor(top: Import, bot: Import){
        this.__top = new hImage(top.dst, 132, 132, 0, 0)
        this.__top.constantHeight = false
        this.__top.x = 66
        this.__top.y = 66
        this.__top.z = 10
        this.__top.renderAlways = true
        this.__top.visible = true

        // this.__bot = new hImage(bot.dst, 132, 132)
        // this.__bot.constantHeight = false
        // this.__bot.x = 66
        // this.__bot.y = 66
        // this.__bot.z = 1
        // this.__bot.renderAlways = true
        // this.__bot.visible = true
    }

    get x(){return this.__x}
    set x(x: number){
        this.__x = x
        this.__top.x = x + 0.1
        // this.__bot.x = x + 65
    }

    get y(){return this.__y}
    set y(y: number){
        this.__y = y
        this.__top.y = y + 0.1
        // this.__bot.y = y + 66
    }

    private __x = 0
    private __y = 0
    private __top: hImage
    // private __bot: hImage
}