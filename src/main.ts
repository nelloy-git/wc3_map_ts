if (!IsGame()){
    new Utils.Import(GetSrc() + '\\map_data\\war3map.doo', 'war3map.doo')
    new Utils.Import(GetSrc() + '\\map_data\\war3map.mmp', 'war3map.mmp')
    new Utils.Import(GetSrc() + '\\map_data\\war3map.shd', 'war3map.shd')
    new Utils.Import(GetSrc() + '\\map_data\\war3map.w3c', 'war3map.w3c')
    new Utils.Import(GetSrc() + '\\map_data\\war3map.w3e', 'war3map.w3e')
    new Utils.Import(GetSrc() + '\\map_data\\war3map.w3i', 'war3map.w3i')
    new Utils.Import(GetSrc() + '\\map_data\\war3map.w3r', 'war3map.w3r')
    new Utils.Import(GetSrc() + '\\map_data\\war3map.wct', 'war3map.wct')
    new Utils.Import(GetSrc() + '\\map_data\\war3map.wpm', 'war3map.wpm')
    new Utils.Import(GetSrc() + '\\map_data\\war3map.wtg', 'war3map.wtg')
    new Utils.Import(GetSrc() + '\\map_data\\war3map.wts', 'war3map.wts')
    new Utils.Import(GetSrc() + '\\map_data\\war3mapMap.blp', 'war3mapMap.blp')
    new Utils.Import(GetSrc() + '\\map_data\\war3mapMisc.txt', 'war3mapMisc.txt')
    new Utils.Import(GetSrc() + '\\map_data\\war3mapUnits.doo', 'war3mapUnits.doo')
}

import * as Abil from './AbilityExt'
import * as Buff from './Buff'
import * as Param from './Parameter'
import * as Utils from "./Utils"

import { BinUnit, BinUnitField } from './Binary'
import { hTimer, hUnit } from './Handle'
import { id2int} from './Utils'
import { Init } from './Interface/Init'
import { LifeForceShield } from './Abilities/LifeForceShield'
import { WorldBar } from './Interface/Utils/WorldBar'

let bin_unit = new BinUnit(id2int('a000'), id2int('hfoo'))
bin_unit.setValue(BinUnitField.HitPointsMaximumBase, 100)
bin_unit.setValue(BinUnitField.ManaMaximum, 100)

let _import_bar = new Utils.Import(GetSrc() + '\\Interface\\Utils\\WorldBar\\generic_bar.mdx',
                                   'war3mapImported\\WorldBar\\generic_bar.mdx')

if (IsGame()){
    SetCameraBounds(-3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    InitBlizzard()

    Init()

    let u = new hUnit(bin_unit.id, 0, 0, Player(0))
    let params = new Param.Unit(u)
    params.set('LIFE', 'BASE', 1000)
    params.set('PATK', 'BASE', 10)
    params.set('PDEF', 'BASE', 5)

    let abils = new Abil.Container(u)
    abils.set(2, LifeForceShield)

    let buffs = new Buff.Container(u)

    let u2 = new hUnit(bin_unit.id, 0, 0, Player(0))
    let params2 = new Param.Unit(u2)
    params2.set('LIFE', 'BASE', 600)
    params2.set('PATK', 'BASE', 10)
    params2.set('PDEF', 'BASE', 5)
    
    let buffs2 = new Buff.Container(u2)

    // let eff = AddSpecialEffectTarget(_import_bar.dst,
    //                                  u.handle,
    //                                  'overhead')
    // BlzSetSpecialEffectHeight(eff, 300) crashes

    // let eff = AddSpecialEffect(_import_bar.dst, 0, 0)
    // BlzSetSpecialEffectMatrixScale(eff, 1, 2, 1)

    // let bar = new WorldBar()
    // bar.target = u
    // bar.offsetZ = 200

    // let t = new hTimer()
    // t.addAction(()=>{bar.fullness = bar.fullness - 0.05})
    // t.start(1, true)

}