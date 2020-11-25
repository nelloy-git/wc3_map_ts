
import { SyncTarget } from './AbilityExt/SyncTarget'
import { Point } from './AbilityExt/Point'
import { Timer, Unit } from './Handle'
import { id2int, Log } from './Utils'
import * as Utils from "./Utils"
import { Ability } from './AbilityExt'
import { TestType } from './AbilityExt/TestType'

import { GlueTextButton, OriginMinimap, OriginPortrait, Screen } from './FrameExt'


if (IsGame()){
    SetCameraBounds(-3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    InitBlizzard()

    let u = new Unit(id2int('hfoo'), 0, 0, Player(0))

    let im = new GlueTextButton()
    Screen.addAction(([x0, y0]) => {
        im.pos = [x0, y0]
    })
    im.size = [0.1, 0.1]
    im.addAction('CLICK', ():void => {print('click')})

    let t = new Timer()
    t.addAction(()=>{
        let portrait = OriginPortrait.instance()

        if (!portrait){return}
        portrait.size = [0.1, 0.1]
        portrait.pos = [0.2, 0.1]
    })
    t.start(1, true)
}

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

//let a2 = new test2.Logger(true, true, true, true, true, true, true, '', '');