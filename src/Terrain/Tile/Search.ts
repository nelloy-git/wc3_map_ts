import { isReforged, Log } from '../../Utils'
import * as SD from './SD'
import * as HD from './HD'

let mode = IsGame() && isReforged(GetLocalPlayer()) ? HD : SD

export function getById(id: string){
    let tileset = id.charAt(0)
    if (tileset == 'A'){
        return getAshenTile(<any>id)
    } else if (tileset == 'Z'){
        return getRuinsTile(id)
    } else if (tileset == 'V'){
        return getVillageTile(id)
    } else {
        return Log.err('unknow tileset ' + tileset)
    }
}

const ID = {
    Adrt: mode.ashen.dirt,
    Adrd: mode.ashen.dirtrough,
    Agrs: mode.ashen.grass,
    Arck: mode.ashen.rock,
    Agrd: mode.ashen.grasslumpy,
    Avin: mode.ashen.vines,
    Adrg: mode.ashen.dirtgrass,
    Alvd: mode.ashen.leaves,

    Bdrt: mode.barrens.dirt,
    Bdrh: mode.barrens.dirtrough,
    Bdrr: mode.barrens.pebbles,
    Bdrg: mode.barrens.dirtgrass,
    Bdsr: mode.barrens.desert,
    Bdsd: mode.barrens.desertdark,
    Bflr: mode.barrens.rock,
    Bgrr: mode.barrens.grass,

    Ddrt: mode.cave.dirt,
    Dbrk: mode.cave.brick,
    Drds: mode.cave.redstones,
    Dlvc: mode.cave.lavacracks,
    Dlav: mode.cave.lava,
    Ddkr: mode.cave.darkrocks,
    Dgrs: mode.cave.greystones,
    Dsqd: mode.cave.squaretiles,

    Kdrt: mode.citadel.dirt,
    Kfsl: mode.citadel.dirtlight,
    Kdtr: mode.citadel.roughdirt,
    Kfst: mode.citadel.flatstones,
    Ksmb: mode.citadel.smallbricks,
    Klgb: mode.citadel.largebricks,
    Ksqt: mode.citadel.squaretiles,
    Kdkt: mode.citadel.darktiles,
    

}

const BARRENS = {

}

function getAshenTile(id: keyof(typeof ASHEN)): string[] | undefined {
    return ASHEN[id]
}

function getRuinsTile(id: string){
    let mode = isReforged(GetLocalPlayer()) ? HD : SD

    if (id == 'Zdrt'){
        return mode.ruins.dirt
    } else if (id == 'Zdrg'){
        return mode.ruins.dirtgrass
    } else if (id == 'Zdtr'){
        return mode.ruins.dirtrough
    } else if (id == 'Zgrs'){
        return mode.ruins.grass
    } else if (id == 'Zvin'){
        return mode.ruins.grassdark
    } else if (id == 'Zbkl'){
        return mode.ruins.largebricks
    } else if (id == 'Ztil'){
        return mode.ruins.roundtiles
    } else if (id == 'Zsan'){
        return mode.ruins.sand
    } else if (id == 'Zbks'){
        return mode.ruins.smallbricks
    } else {
        return Log.err('unknown "ruins" tile. id: ' + id)
    }
}

function getVillageTile(id: string){
    let mode = isReforged(GetLocalPlayer()) ? HD : SD

    if (id == 'Vcbp'){
        return mode.village.cobblepath
    } else if (id == 'Vcrp'){
        return mode.village.crops
    } else if (id == 'Vdrt'){
        return mode.village.dirt
    } else if (id == 'Vdrr'){
        return mode.village.dirtrough
    } else if (id == 'Vgrs'){
        return mode.village.grassshort
    } else if (id == 'Vgrt'){
        return mode.village.grassshort
    } else if (id == 'Vrck'){
        return mode.village.rocks
    } else if (id == 'Vstp'){
        return mode.village.stonepath
    } else {
        return Log.err('unknown "village" tile. id: ' + id)
    }
}