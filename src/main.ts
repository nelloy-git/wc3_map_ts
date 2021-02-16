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
import * as IO from './WcIO'
import * as Map from './Binary'
import * as Utils from "./Utils"

import { TestType as TestAbil } from './AbilityExt/TestType'

import * as UnitType from "./Gameplay/Units/init";

import { id2int} from './Utils'
import { Init } from './Interface/Init'
// import { LifeForceShield } from './Abilities/LifeForceShield'
import { TerrainPreset } from './Binary/Cached/Terrain'
import { id2byte } from './Binary/Utils'
import { Ability } from './AbilityExt'
import { hEffect, hTimer, hUnit } from './Handle'

let w3u = Map.Map.w3u
let unit_type = w3u.add(id2int('hfoo'))
unit_type.setInt(Map.FieldUnitList.HitPointsMaximumBase, 100)
unit_type.setInt(Map.FieldUnitList.ManaMaximum, 100)

// let pref = 'TerrainPresets/MurlocLagoonHD.w3x/war3map.'
// let murloc_lagoon = new TerrainPreset(pref + 'w3e', pref + 'w3d', pref + 'doo')


if (IsGame()){
    SetCameraBounds(-3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    InitBlizzard()

    Init()

    let f = CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetEntireMapRect(), true, true)
    FogModifierStart(f)

    let u1 = UnitType.Ogre.new(0, 0, Player(0))
    let u3 = UnitType.Ogre.new(0, 0, Player(0))

    let u2 = UnitType.Ogre.new(0, 0, Player(1))

    let eff = new hEffect('Abilities\\Spells\\Items\\OrbVenom\\OrbVenomMissile.mdl', 0, 0, 100)
    // let eff = new hEffect('Units\\Creeps\\OgreLord\\OgreLord.mdl', 0, 0, 100)
    
    let t = new hTimer()
    t.addAction(t => {
        eff.visible = !eff.visible
        eff.x += 10
        eff.y += 20
        // let c = eff.color
        // if (c.a == 1){
        //     eff.color = new Utils.Color(1, 1, 1, 0)
        // } else {
        //     eff.color = new Utils.Color(1, 1, 1, 1)
        // }
    })
    t.start(1, true)

    let test = new IO.File('test.txt')
    test.save('Some string data here.')
    print(test.load())

    // let t = new hTimer()
    // t.addAction(()=>{murloc_lagoon.enable(true)})
    // t.start(30, false)
}