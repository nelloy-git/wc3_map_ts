export class hTile {
    constructor(x: number, y: number, h: number, tile: number){
        this.x = x
        this.y = y
        this.h = h
        this.tile = tile
        this._prev_tile = GetTerrainType(x, y)

        let depth = (8192 - this.h) / 4
        TerrainDeformCrater(this.x, this.y, 128, depth, 1, true)
        SetTerrainType(this.x, this.y, this.tile, -1, 1, 1)
        
        // if (Tile._available_tiles){
        //     let found = false
        //     let list = Tile._available_tiles
        //     for (let i = 0; i < list.length; i++){
        //         if (tile == list[i]){
        //             found = true
        //             break
        //         }
        //     }
            
        //     if (!found){
        //         Log.wrn(Tile.name + 
        //                 ': tile \'' + id2byte(tile) + '\' can not be used ' +
        //                 'because it is not included in main map. Refoged bug.')
        //     }
        // }
    }

    destroy(){
        if (!IsGame()){return}

        let depth = (8192 - this.h) / 4
        TerrainDeformCrater(this.x, this.y, 128, -depth, 1, true)

        if (this.tile == GetTerrainType(this.x, this.y)){
            SetTerrainType(this.x, this.y, this.tile, -1, 1, 1)
        }
    }

    readonly x: number
    readonly y: number
    readonly h: number
    readonly tile: number
    private _prev_tile: number
}