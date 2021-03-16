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

function getMapRect(): [cx: number, cy: number, w: number, h: number]{
    let map_rect = GetEntireMapRect()
    let x = GetRectMinX(map_rect)
    let y = GetRectMinY(map_rect)
    let w = GetRectMaxX(map_rect) - x
    let h = GetRectMaxY(map_rect) - y
    RemoveRect(map_rect)

    return [x, y, w, h]
}

export function newImageList(count: number, image?: string){
    if (!IsGame()){
        return []
    }

    image = image ? image : _import_image.dst
    const [cx, cy, w, h] = getMapRect()

    let list: hImage[] = []
    for (let i = 0; i < count; i++){
        let im = new hImage(image)
        list.push(im)

        // Random position
        im.x = cx + w * Math.random()
        im.y = cy + h * Math.random()
    }
    return list
}

let default_model = 'Objects\\Invalidmodel\\Invalidmodel.mdl'

export function newEffectList(count: number, model?: string){
    model = model ? model : default_model
    const [cx, cy, w, h] = getMapRect()

    let list: hEffect[] = []
    for (let i = 0; i < count; i++){
        list.push(new hEffect(model, cx + w * Math.random(), cy + h * Math.random(), 0))
    }
    return list
}