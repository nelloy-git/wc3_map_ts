import * as WcIO from '../../../WcIO'
import * as Handle from '../../../Handle'
import * as Draw from '../../../Drawing'
import * as Utils from '../../../Utils'

import { TTargeting } from '../Targeting'
import { IFace } from '../../Ability/IFace'

export let TTargetingArea = new TTargeting<[Utils.Vec2]>(getTarget)

let cur_abil: IFace<[Utils.Vec2]> | undefined
let circle = new Draw.Arc(Draw.newImageList(200))

if (IsGame()){
    let timer = new Handle.hTimer()
    timer.addAction(mouseTrack)
    timer.start(0.02, true)
}

TTargetingArea.addAction('START', (inst, pl, abil) => {enableDrawing(true, pl, abil)})
TTargetingArea.addAction('STOP', (inst, pl, abil) => {enableDrawing(false, pl, abil)})

function enableDrawing(flag: boolean, pl: jplayer, abil: IFace<[Utils.Vec2]>){
    if (pl != GetLocalPlayer()){return}
    
    cur_abil = flag ? abil : undefined
    WcIO.Selection.lock(flag)

    circle.visible = flag
    if (flag){mouseTrack()}
}

function mouseTrack(this: void){
    if (!cur_abil){return}

    let [targ] = getTarget(cur_abil)
    circle.setPolarPos(targ, cur_abil.Data.area, 0, 2 * math.pi)
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
    
    if (r > abil.Data.range){
        let cos = dx / r
        let sin = dy / r
    
        let range = abil.Data.range
        end_x = range * cos + start_x
        end_y = range * sin + start_y
    }

    let res: [Utils.Vec2] = [new Utils.Vec2(end_x, end_y)]
    return res
}