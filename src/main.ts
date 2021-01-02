if (!IsGame()){
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.doo', 'war3map.doo')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.mmp', 'war3map.mmp')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.shd', 'war3map.shd')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.w3c', 'war3map.w3c')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.w3e', 'war3map.w3e')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.w3i', 'war3map.w3i')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.w3r', 'war3map.w3r')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.wct', 'war3map.wct')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.wpm', 'war3map.wpm')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.wtg', 'war3map.wtg')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3map.wts', 'war3map.wts')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3mapMap.blp', 'war3mapMap.blp')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3mapMisc.txt', 'war3mapMisc.txt')
    new Utils.Import(GetSrc() + '\\map_data.w3m\\war3mapUnits.doo', 'war3mapUnits.doo')
}

import * as Abil from './AbilityExt'
import * as Buff from './Buff'
import * as Param from './Parameter'
import * as Utils from "./Utils"

import { Map, FieldUnit } from './Binary'
import { hEffect, hTimer, hUnit } from './Handle'
import { id2int} from './Utils'
import { Init } from './Interface/Init'
import { LifeForceShield } from './Abilities/LifeForceShield'
import { TerrainPreset } from './Binary/Cached/Terrain'
import { w3dFileOld } from './Binary/w3d/File2'
import { id2byte } from './Binary/Utils'

let w3u = Map.w3u
let bin_unit = w3u.add(id2int('hfoo'))
bin_unit.setInt(FieldUnit.HitPointsMaximumBase, 100)
bin_unit.setInt(FieldUnit.ManaMaximum, 100)

let pref = 'TerrainPresets/MurlocLagoonHD.w3x/war3map.'
let murloc_lagoon = new TerrainPreset(pref + 'w3e', pref + 'w3d', pref + 'doo')
murloc_lagoon.enable(true)

// let w3d = new w3dFile()
// w3d.open('TerrainPresets/MurlocLagoonHD.w3x/war3map.w3d')
// w3d.parse()


if (IsGame()){
    SetCameraBounds(-3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    InitBlizzard()

    Init()

    let f = CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetEntireMapRect(), true, true)
    FogModifierStart(f)

    let u = new hUnit(bin_unit.id, 0, 0, Player(0))
    let params = new Param.Unit(u)
    params.set('LIFE', 'BASE', 1000)
    params.set('PATK', 'BASE', 10)
    params.set('PDEF', 'BASE', 5)
    params.set('RECO', 'BASE', 5)

    let abils = new Abil.Container(u)
    abils.set(2, LifeForceShield)

    let buffs = new Buff.Container(u)

    let u2 = new hUnit(bin_unit.id, 0, 0, Player(0))
    let params2 = new Param.Unit(u2)
    params2.set('LIFE', 'BASE', 600)
    params2.set('PATK', 'BASE', 10)
    params2.set('PDEF', 'BASE', 5)
    params2.set('RECO', 'BASE', 1)
    
    let buffs2 = new Buff.Container(u2)

    
    // TerrainDeformCrater(0, 0, 128, -400, 1, true)

    let t = new hTimer()
    t.addAction(() => {
        let loc = Location(0, 0)
        MoveLocation(loc, 0, 0)

        let eff = new hEffect('Doodads\\Outland\\Props\\Altar\\Altar', 0, 0, GetLocationZ(loc))
        eff.yaw = math.pi / 4
        eff.scaleX = 2
        eff.scaleY = 4
        eff.scaleZ = 0.1
    })
    t.start(0.1, false)
}