import { Color, Import } from '../Utils'
import { hEffect, hImage } from '../Handle';

export interface Pixel {
    destroy(): void

    x: number
    y: number
    z: number
    visible: boolean
    color: Color
}

export type PixelList<T extends Pixel> = Array<T>

let _import_image = new Import(GetSrc() + '/Drawing/Pixel/Pixel.dds',
                                          'war3mapImported/Drawing/Pixel.dds')

export function newImageList(count: number, image?: string){
    image = image ? image : _import_image.dst

    let list: hImage[] = []
    for (let i = 0; i < count; i++){
        list.push(new hImage(image))
    }
    return list
}

let default_model = 'Objects\\Invalidmodel\\Invalidmodel.mdl'

export function newEffectList(count: number, model?: string){
    model = model ? model : default_model

    let list: hEffect[] = []
    for (let i = 0; i < count; i++){
        list.push(new hEffect(model, 0, 0, 0))
    }
    return list
}