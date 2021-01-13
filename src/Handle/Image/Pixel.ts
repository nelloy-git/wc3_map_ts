import { Color, Import } from '../../Utils'
import { hEffect } from '../Effect';
import { hImage } from "../Image";

export interface hPixel {
    destroy(): void

    x: number
    y: number
    z: number
    visible: boolean
    color: Color
}

export type hPixelList<T extends hPixel> = Array<T>