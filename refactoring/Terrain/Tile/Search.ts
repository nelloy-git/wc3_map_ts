import { isReforged, Log } from '../../../src/Utils'
import * as SD from './SD'
import * as HD from './HD'

let mode = IsGame() && isReforged(GetLocalPlayer()) ? HD : SD

export function getById(id: string): string[] | undefined{
    return ID[<keyof typeof ID>id]
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
    
    Ydrt: mode.city.dirt,
    Ydtr: mode.city.dirtrough,
    Yblm: mode.city.blackmarble,
    Ybtl: mode.city.bricktiles,
    Ysqd: mode.city.squaretiles,
    Yrtl: mode.city.roundtiles,
    Ygsb: mode.city.grass,
    Yhdg: mode.city.grasstrim,
    Ywmb: mode.city.whitemarble,
    
    Xdrt: mode.dalaran.dirt,
    Xdtr: mode.dalaran.dirtrough,
    Xblm: mode.dalaran.blackmarble,
    Xbtl: mode.dalaran.bricktiles,
    Xsqd: mode.dalaran.squaretiles,
    Xrtl: mode.dalaran.roundtiles,
    Xgsb: mode.dalaran.grass,
    Xhdg: mode.dalaran.grasstrim,
    Xwmb: mode.dalaran.whitemarble,
    
    Jdrt: mode.druins.dirt,
    Jdtr: mode.druins.dirtrough,
    Jblm: mode.druins.blackmarble,
    Jbtl: mode.druins.bricktiles,
    Jsqd: mode.druins.squaretiles,
    Jrtl: mode.druins.roundtiles,
    Jgsb: mode.druins.grass,
    Jhdg: mode.druins.grasstrim,
    Jwmb: mode.druins.whitemarble,
    
    Cdrt: mode.felwood.dirt,
    Cdrd: mode.felwood.dirtrough,
    Cpos: mode.felwood.poison,
    Crck: mode.felwood.rock,
    Cvin: mode.felwood.vines,
    Cgrs: mode.felwood.grass,
    Clvg: mode.felwood.leaves,
    
    Idrt: mode.ice.dirt,
    Idtr: mode.ice.dirtrough,
    Idki: mode.ice.darkice,
    Ibkb: mode.ice.blackbricks,
    Irbk: mode.ice.runebricks,
    Itbk: mode.ice.tiledbricks,
    Iice: mode.ice.ice,
    Ibsq: mode.ice.blacksquares,
    Isnw: mode.ice.snow,

    Fdrt: mode.lordf.dirt,
    Fdro: mode.lordf.dirtrough,
    Fdrg: mode.lordf.dirtgrass,
    Frok: mode.lordf.rock,
    Fgrs: mode.lordf.grass,
    Fgrd: mode.lordf.grassdark, 
    
    Ldrt: mode.lords.dirt,
    Ldro: mode.lords.dirtrough,
    Ldrg: mode.lords.dirtgrass,
    Lrok: mode.lords.rock,
    Lgrs: mode.lords.grass,
    Lgrd: mode.lords.grassdark,

    Wdrt: mode.lordw.dirt,
    Wdro: mode.lordw.dirtrough,
    Wsng: mode.lordw.snowgrass,
    Wrok: mode.lordw.rock,
    Wgrs: mode.lordw.grass,
    Wsnw: mode.lordw.snow,
    
    Ndrt: mode.north.dirt,
    Ndrd: mode.north.dirtdark,
    Nrck: mode.north.rock,
    Ngrs: mode.north.grass,
    Nice: mode.north.ice,
    Nsnw: mode.north.snow,
    Nsnr: mode.north.snowrock,

    Odrt: mode.outland.dirt,
    Odtr: mode.outland.dirtlight,
    // Osmb: mode.outland.,
    Ofst: mode.outland.dirtcracked,
    Olgb: mode.outland.flatstones,
    Orok: mode.outland.rock,
    Ofsl: mode.outland.flatstoneslight,
    Oaby: mode.outland.abyss,
    
    Zdrt: mode.ruins.dirt,
    Zdtr: mode.ruins.dirtrough,
    Zdrg: mode.ruins.dirtgrass,
    Zbks: mode.ruins.smallbricks,
    Zsan: mode.ruins.sand,
    Zbkl: mode.ruins.largebricks,
    Ztil: mode.ruins.roundtiles,
    Zgrs: mode.ruins.grass,
    Zvin: mode.ruins.grassdark,
    
    Vdrt: mode.village.dirt,
    Vdrr: mode.village.dirtrough,
    Vcrp: mode.village.crops,
    Vcbp: mode.village.cobblepath,
    Vstp: mode.village.stonepath,
    Vgrs: mode.village.grassshort,
    Vrck: mode.village.rocks,
    Vgrt: mode.village.grassthick,

    Qdrt: mode.villagefall.dirt,
    Qdrr: mode.villagefall.dirtrough,
    Qcrp: mode.villagefall.crops,
    Qcbp: mode.villagefall.cobblepath,
    Qstp: mode.villagefall.stonepath,
    Qgrs: mode.villagefall.grassshort,
    Qrck: mode.villagefall.rocks,
    Qgrt: mode.villagefall.grassthick, 
}