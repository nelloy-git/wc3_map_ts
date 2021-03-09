import { getById } from './Search'
import { hImage } from '../../Handle'

// const DEFAULT_ID = 'Zdrt'
const SIZE = 256
const OFFSET = -SIZE / 4

export class Tile {
    constructor(){
        this.__tiles_list = []
        this.__layers = []
        this.__update()
    }

    get x(){return this.__x}
    set x(x: number){
        this.__x = x
        for (let im of this.__layers){
            im.x = x + OFFSET
        }
    }

    get y(){return this.__y}
    set y(y: number){
        this.__y = y
        for (let im of this.__layers){
            im.y = y + OFFSET
        } 
    }

    setCorners(topleft: string | undefined,
               topright: string | undefined,
               botright: string | undefined,
               botleft: string | undefined){
        this.__top_left = topleft
        this.__top_right = topright
        this.__bot_right = botright
        this.__bot_left = botleft
        this.__update()
    }

    set id_list(list: string[]){
        this.__tiles_list = list
        this.__update()
    }

    private __update(){
        for (let im of this.__layers){
            im.destroy()
        }
        this.__layers = []

        let order: string[] = []
        if (this.__top_left && !order.includes(this.__top_left)){order.push(this.__top_left)}
        if (this.__top_right && !order.includes(this.__top_right)){order.push(this.__top_right)}
        if (this.__bot_right && !order.includes(this.__bot_right)){order.push(this.__bot_right)}
        if (this.__bot_left && !order.includes(this.__bot_left)){order.push(this.__bot_left)}
        order.sort((a: string, b: string) => {
            let a_pos = this.__tiles_list.indexOf(a)
            let b_pos = this.__tiles_list.indexOf(b)
            return a_pos - b_pos
        })

        for (let id of order){
            let br = (!this.__bot_right || this.__tiles_list.indexOf(this.__bot_right) >= this.__tiles_list.indexOf(id)) ? 1 : 0
            let bl = (!this.__bot_left || this.__tiles_list.indexOf(this.__bot_left) >= this.__tiles_list.indexOf(id)) ? 2 : 0
            let tr = (!this.__top_right || this.__tiles_list.indexOf(this.__top_right) >= this.__tiles_list.indexOf(id)) ? 4 : 0
            let tl = (!this.__top_left || this.__tiles_list.indexOf(this.__top_left) >= this.__tiles_list.indexOf(id)) ? 8 : 0
            let pos = tl + tr + br + bl

            this.__layers.push(this.__newImg(getById(id)[pos]))
        }
    }

    private __newImg(path: string){
        let img = new hImage(path, SIZE, SIZE, 0, 0)
        img.x = this.__x + OFFSET
        img.y = this.__y + OFFSET
        img.constantHeight = false
        img.renderAlways = true
        img.visible = true
        return img
    }

    private __x = 0
    private __y = 0
    private __tiles_list: string[]
    private __top_left: string | undefined
    private __top_right: string | undefined
    private __bot_right: string | undefined
    private __bot_left: string | undefined
    private __layers: hImage[]
}