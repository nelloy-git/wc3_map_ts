import * as Binary from '../Binary'
import * as Utils from "../Utils"

export class HeightMap {
    static get active(){return this.__active}

    constructor(w3e: Binary.w3eFile, offset: [number, number, number]){
        this.w3e = w3e
        this.offset = offset
    }

    apply(){
        if (HeightMap.__active){
            HeightMap.__active.clear()
        }
        HeightMap.__active = this

        for (let y = 0; y < this.w3e.my; y++){
            for (let x = 0; x < this.w3e.mx; x++){
                let data = this.w3e.get(x, y)
                if (!data){continue}

                let px = 128 * x + this.offset[0]
                let py = 128 * y + this.offset[1]
                let pz = this.offset[2]

                TerrainDeformCrater(px, py, 128, -(data.z + pz), 1, true)
            }
        }
    }

    clear(){
        if (HeightMap.__active != this){
            Utils.Log.wrn(HeightMap.name + ': can not clear inactive instance.')
            return
        }
        HeightMap.__active = undefined
        
        for (let y = 0; y < this.w3e.my; y++){
            for (let x = 0; x < this.w3e.mx; x++){
                let px = 128 * x + this.offset[0]
                let py = 128 * y + this.offset[1]
                TerrainDeformCrater(px, py, 128, Utils.getTerrainZ(px, py), 1, true)
            }
        }
    }
    
    readonly w3e: Binary.w3eFile
    readonly offset: [number, number, number]

    private static __active: HeightMap | undefined
}