export class Tile {
    constructor(id: number, x: number, y: number, z: number){
        this.id = id
        this.x = x
        this.y = y
        this.z = z
    }

    readonly id: number
    readonly x: number
    readonly y: number
    readonly z: number
}
