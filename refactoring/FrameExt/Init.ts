import * as Handle from '../../src/Handle'

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

let post_init_timer: Handle.hTimer
if (IsGame()){
    post_init_timer = new Handle.hTimer()
    post_init_timer.start(0.15, false)
}

export function onPreInit(callback: (this: void)=>void){
    if (IsGame()){
        return pre_init_timer.addAction(callback)
    }
}

export function onInit(callback: (this: void)=>void){
    if (IsGame()){
        return init_timer.addAction(callback)
    }
}

export function onPostInit(callback: (this: void)=>void){
    if (IsGame()){
        return post_init_timer.addAction(callback)
    }
}