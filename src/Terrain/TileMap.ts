import * as Binary from '../Binary'
import { Log } from '../Utils'
import { Tile, SD, HD } from './Tile'

const DEFAULT = Macro(SD.Ashenvale.Dirt[0])

export class TileMap {
    constructor(width: number, height: number, cx?: number, cy?: number){
        this.width = width
        this.height = height

        cx = cx ? cx : 0
        cy = cy ? cy : 0
        this.__tiles = []
        for (let y = 0; y < height; y++){
            for (let x = 0; x < width; x++){
                let t = new Tile()
                t.x = 128 * x + cx
                t.y = 128 * y + cy
                this.__tiles.push(t)
            }
        }
    }

    load(w3e: Binary.w3eFile){
        let tiles_list = w3e.used_tiles
        let max_x = Math.min(this.width, w3e.mx)
        let max_y = Math.min(this.height, w3e.my)

        for (let y = 0; y < max_y; y++){
            for(let x = 0; x < max_x; x++){
                let tile = this.__get(x, y)
                tile.id_list = w3e.used_tiles

                let topleft = w3e.get(x, y + 1)
                let topright = w3e.get(x + 1, y + 1)
                let botright = w3e.get(x + 1, y)
                let botleft = w3e.get(x, y)

                tile.setCorners(topleft ? w3e.used_tiles[topleft.id_pos] : undefined,
                                topright ? w3e.used_tiles[topright.id_pos] : undefined,
                                botright ? w3e.used_tiles[botright.id_pos] : undefined,
                                botleft ? w3e.used_tiles[botleft.id_pos] : undefined)
            }
        }
    }

    private __get(x: number, y: number){
        return this.__tiles[y * this.width + x]
    }

    readonly width: number
    readonly height: number

    private __tiles: Tile[]
}