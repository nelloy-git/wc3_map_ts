import {Unit, Timer} from './Wc3Handle/index'
import { id2int } from './Wc3Utils/Funcs'
import * as Utils from "./Wc3Utils/index"

if (IsGame()){
    let u = new Unit(id2int('hfoo'), 0, 0, Player(0))
    let t = new Timer()
    t.addAction((timer: Timer): void => {print(u.x, u.y)})
    t.start(1, true)
    // SetUnitX(u.handle, 500)
    // u.x = 1500
    // u.y = 500

    //print(u.x, u.y)
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