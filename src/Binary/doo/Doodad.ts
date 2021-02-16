export function newDoodad(id: number, x: number, y: number, z: number, a: number,
                          variation: number, scale_x: number, scale_y: number, scale_z: number){
    return <Doodad>{
        id: id, // = id
        x: x, // = x
        y: y, // = y
        z: z, // = z
        a: a, // = a
        variation: variation, // = variation
        scale_x: scale_x, // = scale_x
        scale_y: scale_y, // = scale_y
        scale_z: scale_z, // = scale_z
    }
}

export type Doodad = {
    readonly id: number
    readonly x: number
    readonly y: number
    readonly z: number
    readonly a: number
    readonly variation: number
    readonly scale_x: number
    readonly scale_y: number
    readonly scale_z: number
}