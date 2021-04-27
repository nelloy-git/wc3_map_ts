import * as Utils from "./Utils"

import { hTimer, hUnit } from './Handle'
import * as Buff from './Buff'
import * as Param from './Parameter'
import * as Frame from './FrameExt'

import { Init } from './Interface/Init'

if (!IsGame()){
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.doo', 'war3map.doo')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.mmp', 'war3map.mmp')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.shd', 'war3map.shd')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.w3c', 'war3map.w3c')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.w3e', 'war3map.w3e')
    // new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.w3i', 'war3map.w3i')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.w3r', 'war3map.w3r')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.wct', 'war3map.wct')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.wpm', 'war3map.wpm')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.wtg', 'war3map.wtg')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3map.wts', 'war3map.wts')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3mapMap.blp', 'war3mapMap.blp')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3mapMisc.txt', 'war3mapMisc.txt')
    new Utils.Import(GetSrc() + '\\maps\\map_data.w3m\\war3mapUnits.doo', 'war3mapUnits.doo')
}

if (IsGame()){
    let u = new hUnit(Utils.id2int('hfoo'), Player(0))
    let buffs = new Buff.Container(u)
    let param = new Param.ContainerUnit(u)

    let t = new hTimer()
    t.actions.add(() => {buffs.add(u, 5, Buff.TestType, undefined)})
    t.start(0.02, true)
    
    Init()

    SetCameraBounds(-3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT),
                    -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM),
                    3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT),
                    3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP),
                    -3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT),
                    3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP),
                    3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT),
                    -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl",
                      "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    InitBlizzard()
}