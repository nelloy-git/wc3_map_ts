import { Vec2 } from '../../../Math'
import { hImage, hTimer } from '../../../Handle'
import { Mouse, Selection } from '../../../WcIO'
import { Arc, hImagePreset } from '../../../Drawing'

import type { Abil } from '../../Abil'
import { TTargeting } from '../Type'

export const TTargetingArea = new TTargeting<[Vec2]>(getTarget)

let cur_abil: Abil<[Vec2]> | undefined
const CIRCLE = IsGame() ? new Arc(hImagePreset(200)) : <Arc<hImage>><unknown> undefined

if (IsGame()){
    const timer = new hTimer()
    timer.actions.add(mouseTrack)
    timer.start(0.02, true)
}

TTargetingArea.actions.add('START', (e, inst, pl, abil) => {enableDrawing(true, pl, abil)})
TTargetingArea.actions.add('END', (e, inst, pl, abil) => {enableDrawing(false, pl, abil)})

function enableDrawing(flag: boolean, pl: jplayer, abil: Abil<[Vec2]>){
    print('Targeting: ', flag)
    if (pl != GetLocalPlayer()){
        return
    }
    
    cur_abil = flag ? abil : undefined
    Selection.lock(flag, pl)

    CIRCLE.visible = flag
    if (flag){
        CIRCLE.setPolarPos(Mouse.pos(pl), abil.Data.area, 0, 2 * math.pi)
    }
}

function mouseTrack(this: void){
    if (!cur_abil){
        return
    }

    let [targ] = getTarget(cur_abil)
    CIRCLE.center = targ
}

function getTarget(this: void, abil: Abil<[Vec2]>): [Vec2]{
    let owner = abil.owner.pos2
    let mouse = Mouse.pos(GetLocalPlayer())
    let delta = mouse.sub(owner)

    delta.length = Math.min(delta.length, abil.Data.range)

    return [owner.add(delta)]
}