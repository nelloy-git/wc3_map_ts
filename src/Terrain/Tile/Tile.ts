import { getById } from './Search'
import { hImage } from '../../Handle'

// const DEFAULT_ID = 'Zdrt'
const SIZE = 256
const OFFSET = -SIZE / 4

export class TileTexture {
    constructor(layer_ids: string[]){
        this.__layer_ids = layer_ids
        this.__layers = []

        this.__corners = [layer_ids.length - 1,
                          layer_ids.length - 1,
                          layer_ids.length - 1,
                          layer_ids.length - 1]
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

    // Positions in layer_ids
    setCorners(topleft: number | undefined,
               topright: number | undefined,
               botright: number | undefined,
               botleft: number | undefined){
        this.__corners = [topleft ? topleft : this.__layer_ids.length - 1,
                          topright ? topright : this.__layer_ids.length - 1,
                          botright ? botright : this.__layer_ids.length - 1,
                          botleft ? botleft : this.__layer_ids.length - 1]
        this.__update()
    }

    destroy(){
        for (let im of this.__layers){
            im.destroy()
        }
        this.__layers = []
    }

    private __update(){
        for (let im of this.__layers){
            im.destroy()
        }
        this.__layers = []

        for (let id_pos = this.__layer_ids.length - 1; id_pos >= 0; id_pos--){
            let found = false
            for (let corn of this.__corners){
                if (corn == id_pos){
                    found = true
                    break
                }
            }

            if (!found){continue}

            let id = this.__layer_ids[id_pos]

            let tl = this.__corners[0] <= id_pos ? 8 : 0
            let tr = this.__corners[1] <= id_pos ? 4 : 0
            let br = this.__corners[2] <= id_pos ? 1 : 0
            let bl = this.__corners[3] <= id_pos ? 2 : 0
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
    private __layer_ids: string[]
    private __corners: [tl: number, tr: number, br: number, bl: number]
    private __layers: hImage[]
}