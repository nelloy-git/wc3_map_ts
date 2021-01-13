import { Mouse, Selection } from '../../../Input'
import { hImage, hArc, hLine, hTimer, hUnit } from '../../../Handle'
import { TTargeting } from '../Targeting'
import { Point } from '../../Point'
import { IFace } from '../../Ability/IFace'

export let TTargetingCone = new TTargeting<[Point]>(getTarget)

let cur_abil: IFace<[hUnit]> | undefined
let line_l = IsGame() ? new hLine(initPixels(200)) : <hLine<hImage>><unknown>undefined
let line_r = IsGame() ? new hLine(initPixels(200)) : <hLine<hImage>><unknown>undefined
let arc_f = IsGame() ? new hArc(initPixels(200)) : <hLine<hImage>><unknown>undefined
let arc_b = IsGame() ? new hArc(initPixels(200)) : <hLine<hImage>><unknown>undefined

if (IsGame()){
    let timer = new hTimer()
    timer.addAction(mouseTrack)
    timer.start(0.02, true)
}

TTargetingCone.addAction('START', (inst, pl, abil) => {enableDrawing(true, pl, abil)})
TTargetingCone.addAction('STOP', (inst, pl, abil) => {enableDrawing(false, pl, abil)})

function initPixels(count: number){
    let list = []
    for (let i = 0; i < count; i++){
        list.push(new hImage())
    }
    return list
}

function enableDrawing(flag: boolean, pl: jplayer, abil: IFace<[hUnit]>){
    if (pl != GetLocalPlayer()){return}
    
    cur_abil = flag ? abil : undefined
    Selection.lock(flag)

    line_l.visible = flag
    line_r.visible = flag
    arc_f.visible = flag
    arc_b.visible = flag

    if (flag){mouseTrack()}
}

function mouseTrack(this: void){
    if (!cur_abil){return}

    let owner = cur_abil.Data.owner
    let [end] = getTarget(GetLocalPlayer(), cur_abil)

    let a = Atan2(end.y - owner.y, end.x - owner.x)
    let width_angle = cur_abil.Data.area / 2
    let range = cur_abil.Data.range

    line_l.setPolarPos2(owner.x, owner.y, 48, a - width_angle, range, a - width_angle)
    line_r.setPolarPos2(owner.x, owner.y, 48, a + width_angle, range, a + width_angle)
    arc_f.setPolarPos(owner.x, owner.y, range, a - width_angle, a + width_angle)
    arc_b.setPolarPos(owner.x, owner.y, 48, a - width_angle, a + width_angle)
}

function getTarget(this: void, pl: jplayer, abil: IFace<[Point]>){
    let owner = abil.Data.owner

    let start_x = owner.x
    let start_y = owner.y
    let end_x = Mouse.getX(pl)
    let end_y = Mouse.getY(pl)

    let dx = end_x - start_x
    let dy = end_y - start_y
    let r = SquareRoot(dx * dx + dy * dy)
    let cos = dx / r
    let sin = dy / r

    let range = abil.Data.range
    end_x = range * cos + start_x
    end_y = range * sin + start_y

    let res: [Point] = [new Point(end_x, end_y)]
    return res
}