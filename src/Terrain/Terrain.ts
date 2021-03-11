import * as Binary from '../Binary'
import * as Utils from "../Utils"

import { DoodadMap } from './DoodadMap'
import { HeightMap } from './HeightMap'
import { TileMap } from './TileMap'

let __path__ = Macro(Utils.getFilePath())

export class Terrain {
    constructor(name: string, icon: string, offset: [number, number, number],
                w3e: Binary.w3eFile, w3d: Binary.w3dFile, doo: Binary.dooFile){
        this.name = name
        this.icon = icon
        this.offset = offset

        this.__height_map = new HeightMap(w3e, offset)
        this.__tile_map = new TileMap(w3e, offset)
        this.__dood_map = new DoodadMap(w3d, doo, [offset[0] - w3e.cx, offset[1] - w3e.cy, 0]) 
    }

    apply(){
        if (Terrain.__active){
            Terrain.__active.clear()
        }
        Terrain.__active = this

        this.__tile_map.apply()
        this.__height_map.apply()
        this.__dood_map.apply()
    }

    clear(){
        if (Terrain.__active != this){
            Utils.Log.wrn(Terrain.name + ': can not clear inactive instance.')
            return
        }
        Terrain.__active = undefined
        
        this.__tile_map.clear()
        this.__height_map.clear()
        this.__dood_map.clear()
    }
    
    readonly name: string
    readonly icon: string
    readonly offset: [number, number, number]

    private __tile_map: TileMap
    private __height_map: HeightMap
    private __dood_map: DoodadMap
    
    private static __active: Terrain | undefined
}