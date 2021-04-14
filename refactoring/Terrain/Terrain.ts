import * as Binary from '../../src/Binary'
import * as Utils from "../../src/Utils"

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

// let w3e_path = Macro(GetSrc() + '/Terrain/Preset/Test1.w3m/war3map.w3e')
// let w3d_path = Macro(GetSrc() + '/Terrain/Preset/Test1.w3m/war3map.w3d')
// let doo_path = Macro(GetSrc() + '/Terrain/Preset/Test1.w3m/war3map.doo')

// let w3e_bin = new Utils.FileBinary()
// let w3d_bin = new Utils.FileBinary()
// let doo_bin = new Utils.FileBinary()
// if (!IsGame()){
//     w3e_bin.read(w3e_path)
//     w3d_bin.read(w3d_path)
//     doo_bin.read(doo_path)

//     w3e_bin.saveCache(w3e_path)
//     w3d_bin.saveCache(w3d_path)
//     doo_bin.saveCache(doo_path)
// } else {
//     w3e_bin.loadCache(w3e_path)
//     w3d_bin.loadCache(w3d_path)
//     doo_bin.loadCache(doo_path)
// }

        // let w3e = Binary.w3eFile.fromBinary(w3e_bin)
        // let w3d = Binary.w3dFile.fromBinary(w3d_bin)
        // let doo = Binary.dooFile.fromBinary(doo_bin)

        // let map_rect = GetEntireMapRect()
        // let cx = GetRectMinX(map_rect)
        // let cy = GetRectMinY(map_rect)
        // let t = new Terrain('Test', 'Test', [cx, cy, 256], w3e, w3d, doo)
        // t.apply()