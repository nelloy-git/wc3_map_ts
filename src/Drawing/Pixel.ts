import { Vec3 } from '../Math'
import { Color, Import } from '../Utils'
import { hEffect, hImage } from '../Handle';

export interface Pixel {
    destroy(): void

    pos: Vec3
    visible: boolean
    color: Color
}

export type PixelList<T extends Pixel> = Array<T>
