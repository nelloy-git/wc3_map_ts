import * as WcIO from '../../../WcIO'
import * as Handle from '../../../Handle'
import * as Draw from '../../../Drawing'
import * as Utils from '../../../Utils'

import { TTargeting } from '../Targeting'
import { IFace } from '../../Ability/IFace'

export let TTargetingCone = new TTargeting<[Utils.Vec2]>(getTarget)

const L_LINE = new Draw.Line(Draw.newImageList(200))
const R_LINE = new Draw.Line(Draw.newImageList(200))
const FAR_ARC = new Draw.Arc(Draw.newImageList(200))
const NEAR_ARC = new Draw.Arc(Draw.newImageList(100))

let cur_abil: IFace<[Utils.Vec2]> | undefined

if (IsGame()){
    let timer = new Handle.hTimer()
    timer.addAction(mouseTrack)
    timer.start(0.02, true)
}

TTargetingCone.addAction('START', (inst, pl, abil) => {enableDrawing(true, pl, abil)})
TTargetingCone.addAction('STOP', (inst, pl, abil) => {enableDrawing(false, pl, abil)})

function enableDrawing(flag: boolean, pl: jplayer, abil: IFace<[Utils.Vec2]>){
    if (pl != GetLocalPlayer()){return}
    
    cur_abil = flag ? abil : undefined
    WcIO.Selection.lock(flag)

    L_LINE.visible = flag
    R_LINE.visible = flag
    FAR_ARC.visible = flag
    NEAR_ARC.visible = flag

    if (flag){mouseTrack()}
}

function mouseTrack(this: void){
    if (!cur_abil){return}

    let owner = cur_abil.Data.owner
    let [end] = getTarget(cur_abil)

    let a = Atan2(end.y - owner.y, end.x - owner.x)
    let width_angle = cur_abil.Data.area / 2
    let range = cur_abil.Data.range

    let cx = owner.x
    let cy = owner.y
    L_LINE.setPolarPos(cx, cy, 48, a - width_angle, range, a - width_angle)
    R_LINE.setPolarPos(cx, cy, 48, a + width_angle, range, a + width_angle)
    FAR_ARC.setPolarPos(cx, cy, range, a - width_angle, a + width_angle)
    NEAR_ARC.setPolarPos(cx, cy, 48, a - width_angle, a + width_angle)
}

function getTarget(this: void, abil: IFace<[Utils.Vec2]>){
    let owner = abil.Data.owner

    let start_x = owner.x
    let start_y = owner.y
    let end_x = WcIO.Mouse.getX()
    let end_y = WcIO.Mouse.getY()

    let dx = end_x - start_x
    let dy = end_y - start_y
    let r = SquareRoot(dx * dx + dy * dy)
    let cos = dx / r
    let sin = dy / r

    let range = abil.Data.range
    end_x = range * cos + start_x
    end_y = range * sin + start_y

    let res: [Utils.Vec2] = [new Utils.Vec2(end_x, end_y)]
    return res
}