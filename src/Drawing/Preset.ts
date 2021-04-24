import { Import } from '../Utils'
import { hEffect, hImage } from '../Handle'
import { Vec3 } from '../Math'

function getMapRect(){
    let map_rect = GetEntireMapRect()
    let x = GetRectMinX(map_rect)
    let y = GetRectMinY(map_rect)
    let w = GetRectMaxX(map_rect) - x
    let h = GetRectMaxY(map_rect) - y
    RemoveRect(map_rect)

    return [x, y, w, h]
}

const [map_x, map_y, map_w, map_h] = IsGame() ? getMapRect() : [0, 0, 0, 0]

const DEFAULT_IMG = new Import(GetSrc() + '/Drawing/Pixel/Pixel.dds',
                               'war3mapImported/Drawing/Pixel.dds').dst

export function hImagePreset(count: number, image: string = DEFAULT_IMG){
    let m = new Vec3(map_x, map_y, 0)
    let list: hImage[] = []
    for (let i = 0; i < count; i++){
        let im = new hImage(image)
        list.push(im)

        // Random position
        im.visible = false
        im.pos = new Vec3(map_w * Math.random(), map_h * Math.random(), 0).add(m)
    }
    return list
}

const DEFAULT_MODEL = 'Objects\\Invalidmodel\\Invalidmodel.mdl'

export function hEffectPreset(count: number, model: string = DEFAULT_MODEL){
    let m = new Vec3(map_x, map_y, 0)
    let list: hEffect[] = []
    for (let i = 0; i < count; i++){
        let eff = new hEffect(model)
        list.push(eff)

        // Random position
        eff.visible = false
        eff.pos = new Vec3(map_w * Math.random(), map_h * Math.random(), 0).add(m)
    }
    return list
}