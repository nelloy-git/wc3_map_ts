import * as Binary from '../../src/Binary'
import * as Utils from "../../src/Utils"

export class HeightMap {
    constructor(w3e: Binary.w3eFile, offset: [number, number, number]){
        this.w3e = w3e
        this.offset = offset
    }

    apply(){
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
}