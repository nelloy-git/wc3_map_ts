export function newDoodad(id: number, x: number, y: number, z: number, a: number,
                          variation: number, scale_x: number, scale_y: number, scale_z: number){
    return <Doodad>{
        id: id,
        pos: [x, y, z],
        angle: a,
        variation: variation,
        scale: [scale_x, scale_y, scale_z],
    }
}

export type Doodad = {
    readonly id: number
    readonly pos: [number, number, number]
    readonly angle: number
    readonly variation: number
    readonly scale: [number, number, number]
}