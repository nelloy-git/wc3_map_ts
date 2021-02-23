export type Tile = {
    readonly id: string
    readonly pos: [x: number, y: number, z: number]
}

export namespace Tile {
    export function create(id: string, x: number, y: number, z: number): Tile{
        return {
            id: id,
            pos: [x, y, z]
        }
    }
}