import { Mouse, Selection } from '../../../WcIO'
import { hImage, hTimer, hUnit } from '../../../Handle'
import { Line, newImageList} from '../../../Drawing'

import { TTargeting } from '../Targeting'
import { Point } from '../../Point'
import { IFace } from '../../Ability/IFace'

export let TTargetingLine = new TTargeting<[Point]>(getTarget)

let cur_abil: IFace<[hUnit]> | undefined
let line_l = IsGame() ? new Line(newImageList(200)) : <Line<hImage>><unknown>undefined
let line_r = IsGame() ? new Line(newImageList(200)) : <Line<hImage>><unknown>undefined
let end_l = IsGame() ? new Line(newImageList(100)) : <Line<hImage>><unknown>undefined
let end_r = IsGame() ? new Line(newImageList(100)) : <Line<hImage>><unknown>undefined

if (IsGame()){
    let timer = new hTimer()
    timer.addAction(mouseTrack)
    timer.start(0.02, true)
}

TTargetingLine.addAction('START', (inst, pl, abil) => {enableDrawing(true, pl, abil)})
TTargetingLine.addAction('STOP', (inst, pl, abil) => {enableDrawing(false, pl, abil)})

function enableDrawing(flag: boolean, pl: jplayer, abil: IFace<[hUnit]>){
    if (pl != GetLocalPlayer()){return}
    
    cur_abil = flag ? abil : undefined
    Selection.lock(flag)

    line_l.visible = flag
    line_r.visible = flag
    end_l.visible = flag
    end_r.visible = flag

    if (flag){mouseTrack()}
}

function mouseTrack(this: void){
    if (!cur_abil){return}

    let owner = cur_abil.Data.owner
    let [end] = getTarget(GetLocalPlayer(), cur_abil)

    let dx = end.x - owner.x
    let dy = end.y - owner.y
    let a = Atan2(dy, dx)
    let w = cur_abil.Data.area / 2
    let r = SquareRoot(dx * dx + dy * dy)

    let cx = end.x
    let cy = end.y
    end_l.setPolarPos(cx, cy, 0, 0, 2 * w, a - 5 / 6 * math.pi)
    end_r.setPolarPos(cx, cy, 0, 0, 2 * w, a + 5 / 6 * math.pi)
    line_l.setPolarPos(end_l.x2, end_l.y2, 0, 0, r - w, a + math.pi)
    line_r.setPolarPos(end_r.x2, end_r.y2, 0, 0, r - w, a + math.pi)
}

function getTarget(this: void, pl: jplayer, abil: IFace<[Point]>){
    let owner = abil.Data.owner

    let start_x = owner.x
    let start_y = owner.y
    let end_x = Mouse.getX(pl)
    let end_y = Mouse.getY(pl)

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

    let res: [Point] = [new Point(end_x, end_y)]
    return res
}