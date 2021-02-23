export type Doodad = {
    readonly id: string
    readonly pos: [number, number, number]
    readonly a: number
    readonly var: number
    readonly sc: [number, number, number]
}

export namespace Doodad {
    export function create(id: string, x: number, y: number, z: number, a: number,
                            variation: number, scale_x: number, scale_y: number, scale_z: number): Doodad{
        return {
            id: id,
            pos: [x, y, z],
            a: a,
            var: variation,
            sc: [scale_x, scale_y, scale_z],
        }
    }
}