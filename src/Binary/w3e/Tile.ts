export class Tile {
    constructor(x: number, y: number, h: number, tile: number){
        this.x = x
        this.y = y
        this.h = h
        this.tile = tile
    }

    readonly x: number
    readonly y: number
    readonly h: number
    readonly tile: number
}
