import { hTimer } from '../Handle'

function newTimer(delay: number){
    let t = new hTimer()
    t.start(delay, false)
    return t
}

let pre_init_timer: hTimer
if (IsGame()){
    pre_init_timer = newTimer(0.05)
}

let init_timer: hTimer
if (IsGame()){
    init_timer = newTimer(0.1)
}

let post_init_timer: hTimer
if (IsGame()){
    post_init_timer = newTimer(0.15)
}

export function onPreInit(callback: (this: void) => void){
    if (IsGame()){
        return pre_init_timer.actions.add(callback)
    }
}

export function onInit(callback: (this: void) => void){
    if (IsGame()){
        return init_timer.actions.add(callback)
    }
}

export function onPostInit(callback: (this: void) => void){
    if (IsGame()){
        return post_init_timer.actions.add(callback)
    }
}