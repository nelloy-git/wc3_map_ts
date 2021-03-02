import { hImage } from '../../Handle'
import { Color, getFileDir, getFilePath, Import } from '../../Utils'

const __dir__ = Macro(getFileDir())

const dstAshenvaleDirtSD = '/SD/Ashenvale/Dirt'
const srcAshenvaleDirtSD = __dir__ + dstAshenvaleDirtSD
export const tile_00_00 = new Import(srcAshenvaleDirtSD + '/00_00.dds', dstAshenvaleDirtSD + '/00_00.dds')
export const tile_00_01 = new Import(srcAshenvaleDirtSD + '/00_01.dds', dstAshenvaleDirtSD + '/00_01.dds')
export const tile_00_02 = new Import(srcAshenvaleDirtSD + '/00_02.dds', dstAshenvaleDirtSD + '/00_02.dds')
export const tile_01_00 = new Import(srcAshenvaleDirtSD + '/01_00.dds', dstAshenvaleDirtSD + '/01_00.dds')
export const tile_1 = new Import(srcAshenvaleDirtSD + '/1.dds', dstAshenvaleDirtSD + '/1.dds')
// export const tile_01_01 = new Import(srcAshenvaleDirtSD + '/01_01.dds', dstAshenvaleDirtSD + '/01_01.dds')


export class TerrainTile {
    constructor(top: Import, bot: Import){
        this.__top = new hImage(top.dst, 256, 256, 0, 0)
        this.__top.constantHeight = false
        this.__top.x = -64
        this.__top.y = -64
        this.__top.z = 12
        this.__top.renderAlways = true
        this.__top.visible = true
        this.__top.color = new Color(1, 1, 1, 0.1)
        SetImageAboveWater(this.__top.handle, true, false)

        // this.__bot = new hImage(bot.dst, 133, 133, 0, 0)
        // this.__bot.constantHeight = false
        // this.__bot.x = 0
        // this.__bot.y = 0
        // this.__bot.z = 1
        // this.__bot.renderAlways = true
        // this.__bot.visible = true
    }

    get x(){return this.__x}
    set x(x: number){
        this.__x = x
        this.__top.x = x - 64
        // this.__bot.x = x
    }

    get y(){return this.__y}
    set y(y: number){
        this.__y = y
        this.__top.y = y - 64
        // this.__bot.y = y
    }

    private __x = 0
    private __y = 0
    private __top: hImage
    // private __bot: hImage
}