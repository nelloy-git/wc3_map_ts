import * as test from "./test"

if (IsGame()){
    let u = CreateUnit(Player(0), FourCC('hfoo'), 0, 0, 0)
}

/** @noSelf */
function cb(){
    print('azaza');
}

let a = new test.Action(cb);