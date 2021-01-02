import { hEffect } from "../../Handle";

export class Doodad {
    constructor(id: number,
                x: number, y: number, z: number, a: number,
                scale_x: number, scale_y: number, scale_z: number){
        this.id = id
        this.x = x
        this.y = y
        this.z = z
        this.a = a
        this.scale_x = scale_x
        this.scale_y = scale_y
        this.scale_z = scale_z
    }

    readonly id: number
    readonly x: number
    readonly y: number
    readonly z: number
    readonly a: number
    readonly scale_x: number
    readonly scale_y: number
    readonly scale_z: number
    // readonly flags: number
    // readonly life: number
}