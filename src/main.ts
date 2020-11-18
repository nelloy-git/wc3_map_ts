import * as test from "./Utils/Action"
import * as test2 from "./Utils/Logger"

if (IsGame()){
    let u = CreateUnit(Player(0), FourCC('hfoo'), 0, 0, 0)
}

/** @noSelf */
function cb(){
    print('azaza');
}

let a = new test.Action(cb);
a.run()

let a2 = new test2.Logger(true, true, true, true, true, true, true, '', '');