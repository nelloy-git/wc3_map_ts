import * as Binary from '../Binary'
import * as Utils from "../Utils"

import { Tile } from './Tile'

export class TileMap {
    static get active(){return this.__active}
    
    constructor(w3e: Binary.w3eFile, offset: [number, number, number]){
        this.w3e = w3e
        this.offset = offset
        
        this.__tiles = []
    }

    apply(){
        if (TileMap.__active){
            TileMap.__active.clear()
        }
        TileMap.__active = this
        
        let id_list = this.w3e.used_tiles
        this.__tiles = []
        for (let y = 0; y < this.w3e.mx; y++){
            for(let x = 0; x < this.w3e.my; x++){
                let t = new Tile(id_list)
                this.__tiles.push(t)

                let tl = this.w3e.getIdPos(x, y + 1)
                let tr = this.w3e.getIdPos(x + 1, y + 1)
                let br = this.w3e.getIdPos(x + 1, y)
                let bl = this.w3e.getIdPos(x, y)

                t.setCorners(tl, tr, br, bl)
            }
        }
    }

    clear(){
        if (TileMap.__active != this){
            Utils.Log.wrn(TileMap.name + ': can not clear inactive instance.')
            return
        }
        TileMap.__active = undefined

        for (let tile of this.__tiles){
            tile.destroy()
        }
        this.__tiles = []
    }

    readonly w3e: Binary.w3eFile
    readonly offset: [number, number, number]
    private __tiles: Tile[]
    
    private static __active: TileMap | undefined
}