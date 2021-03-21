import * as WcIO from '../../../WcIO'
import * as Handle from '../../../Handle'
import * as Draw from '../../../Drawing'
import * as Utils from '../../../Utils'

import { TTargeting } from '../Targeting'
import { IFace } from '../../Ability/IFace'

export let TTargetingLine = new TTargeting<[Utils.Vec2]>(getTarget)

const L_LINE = new Draw.Line(Draw.newImageList(200))
const R_LINE = new Draw.Line(Draw.newImageList(200))
const L_ARROW = new Draw.Line(Draw.newImageList(100))
const R_ARROW = new Draw.Line(Draw.newImageList(100))

let cur_abil: IFace<[Utils.Vec2]> | undefined

if (IsGame()){
    let timer = new Handle.hTimer()
    timer.addAction(mouseTrack)
    timer.start(0.02, true)
}

TTargetingLine.addAction('START', (inst, pl, abil) => {enableDrawing(true, pl, abil)})
TTargetingLine.addAction('STOP', (inst, pl, abil) => {enableDrawing(false, pl, abil)})

function enableDrawing(flag: boolean, pl: jplayer, abil: IFace<[Utils.Vec2]>){
    if (pl != GetLocalPlayer()){return}
    
    cur_abil = flag ? abil : undefined
    WcIO.Selection.lock(flag)

    L_LINE.visible = flag
    R_LINE.visible = flag
    L_ARROW.visible = flag
    R_ARROW.visible = flag

    if (flag){mouseTrack()}
}

function mouseTrack(this: void){
    if (!cur_abil){return}

    let owner = cur_abil.Data.owner
    let [end] = getTarget(cur_abil)

    let dx = end.x - owner.x
    let dy = end.y - owner.y
    let a = Atan2(dy, dx)
    let w = cur_abil.Data.area / 2
    let r = SquareRoot(dx * dx + dy * dy)

    L_ARROW.setPolarPos(end, 0, 0, 2 * w, a - 5 / 6 * math.pi)
    R_ARROW.setPolarPos(end, 0, 0, 2 * w, a + 5 / 6 * math.pi)
    L_LINE.setPolarPos(L_ARROW.p2, 0, 0, r - w, a + math.pi)
    R_LINE.setPolarPos(R_ARROW.p2, 0, 0, r - w, a + math.pi)
}

function getTarget(this: void, abil: IFace<[Utils.Vec2]>){
    let owner = abil.Data.owner

    let start_x = owner.x
    let start_y = owner.y
    let end_x = WcIO.Mouse.getX()
    let end_y = WcIO.Mouse.getY()

    let dx = end_x - start_x
    let dy = end_y - start_y
    let a = Atan2(dy, dx)
    let w = abil.Data.area / 2
    let r = SquareRoot(dx * dx + dy * dy)
    
    if (r < w){
        r = w
        end_x = r * Cos(a) + start_x
        end_y = r * Sin(a) + start_y
    } else if (r > abil.Data.range) {
        r = abil.Data.range
        end_x = r * Cos(a) + start_x
        end_y = r * Sin(a) + start_y
    }

    let res: [Utils.Vec2] = [new Utils.Vec2(end_x, end_y)]
    return res
}