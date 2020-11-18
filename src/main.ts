import * as Utils from "./Wc3Utils/API"

if (IsGame()){
    let u = CreateUnit(Player(0), FourCC('hfoo'), 0, 0, 0)
}

/** @noSelf */
function cb(){
    print('azaza');
}

let a = new Utils.Action(cb)
a.run()

Utils.Log.msg('axxaxaxz')
Utils.Log.msg('axxaxaxz')
Utils.Log.msg('axxaxaxz')
Utils.Log.msg('axxaxaxz')

//let a2 = new test2.Logger(true, true, true, true, true, true, true, '', '');