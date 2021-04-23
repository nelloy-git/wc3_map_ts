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

// const __import_image = new Import(GetSrc() + '/Drawing/Pixel/Pixel.dds',
//                                   'war3mapImported/Drawing/Pixel.dds')

// function getMapRect(): [x: number, y: number, w: number, h: number]{
//     let map_rect = GetEntireMapRect()
//     let x = GetRectMinX(map_rect)
//     let y = GetRectMinY(map_rect)
//     let w = GetRectMaxX(map_rect) - x
//     let h = GetRectMaxY(map_rect) - y
//     RemoveRect(map_rect)

//     return [x, y, w, h]
// }

// export function newImageList(count: number, image?: string){
//     if (!IsGame()){
//         return []
//     }

//     image = image ? image : __import_image.dst
//     const [x, y, w, h] = getMapRect()

//     let list: hImage[] = []
//     for (let i = 0; i < count; i++){
//         let im = new hImage(image)
//         list.push(im)

//         // Random position
//         im.x = cx + w * Math.random()
//         im.y = cy + h * Math.random()
//         im.visible = false
//     }
//     return list
// }

// let default_model = 'Objects\\Invalidmodel\\Invalidmodel.mdl'

// export function newEffectList(count: number, model?: string){
//     model = model ? model : default_model
//     const [cx, cy, w, h] = getMapRect()

//     let list: hEffect[] = []
//     for (let i = 0; i < count; i++){
//         let v = new Vec3(cx + w * Math.random(), cy + h * Math.random(), 0)
//         let eff = new hEffect(model, v)
//         list.push(eff)
//         eff.visible = false
//     }
//     return list
// }