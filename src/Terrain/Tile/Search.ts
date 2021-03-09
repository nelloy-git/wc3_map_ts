import { isReforged, Log } from '../../Utils'
import * as SD from './SD'
import * as HD from './HD'

export function getById(id: string){
    let tileset = id.charAt(0)
    if (tileset == 'Z'){
        return getRuinsTile(id)
    } else if (tileset == 'V'){
        return getVillageTile(id)
    } else {
        return Log.err('unknow tileset ' + tileset)
    }
}

function getRuinsTile(id: string){
    let mode = isReforged(GetLocalPlayer()) ? HD : SD

    if (id == 'Zdrt'){
        return mode.Ruins.Dirt
    } else if (id == 'Zdrg'){
        return mode.Ruins.DirtGrass
    } else if (id == 'Zdtr'){
        return mode.Ruins.DirtRough
    } else if (id == 'Zgrs'){
        return mode.Ruins.Grass
    } else if (id == 'Zvin'){
        return mode.Ruins.GrassDark
    } else if (id == 'Zbkl'){
        return mode.Ruins.LargeBricks
    } else if (id == 'Ztil'){
        return mode.Ruins.RoundTiles
    } else if (id == 'Zsan'){
        return mode.Ruins.Sand
    } else if (id == 'Zbks'){
        return mode.Ruins.SmallBricks
    } else {
        return Log.err('unknown "Ruins" tile. id: ' + id)
    }
}

function getVillageTile(id: string){
    let mode = isReforged(GetLocalPlayer()) ? HD : SD

    if (id == 'Vcbp'){
        return mode.Village.CobblePath
    } else if (id == 'Vcrp'){
        return mode.Village.Crops
    } else if (id == 'Vdrt'){
        return mode.Village.Dirt
    } else if (id == 'Vdrr'){
        return mode.Village.DirtRough
    } else if (id == 'Vgrs'){
        return mode.Village.GrassShort
    } else if (id == 'Vgrt'){
        return mode.Village.GrassThick
    } else if (id == 'Vrck'){
        return mode.Village.Rocks
    } else if (id == 'Vstp'){
        return mode.Village.StonePath
    } else {
        return Log.err('unknown "Village" tile. id: ' + id)
    }
}