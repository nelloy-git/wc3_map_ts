import * as Handle from '../Handle'

let pre_init_timer: Handle.hTimer
if (IsGame()){
    pre_init_timer = new Handle.hTimer()
    pre_init_timer.start(0.05, false)
}

let init_timer: Handle.hTimer
if (IsGame()){
    init_timer = new Handle.hTimer()
    init_timer.start(0.1, false)
}

export function onPreInit(callback: ()=>void){
    if (IsGame()){
        pre_init_timer.addAction(callback)
    }
}

export function onInit(callback: ()=>void){
    if (IsGame()){
        init_timer.addAction(callback)
    }
}