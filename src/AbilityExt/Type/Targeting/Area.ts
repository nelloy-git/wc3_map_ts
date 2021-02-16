import { Mouse, Selection } from '../../../WcIO'
import { Arc, newImageList } from '../../../Drawing'
import { TTargeting } from '../Targeting'
import { Point } from '../../Point'
import { IFace } from '../../Ability/IFace'
import { hImage, hTimer, hUnit } from '../../../Handle'

export let TTargetingArea = new TTargeting<[Point]>(getTarget)

let cur_abil: IFace<[hUnit]> | undefined
let circle = IsGame() ? new Arc(newImageList(200)) : <Arc<hImage>><unknown>undefined

if (IsGame()){
    let timer = new hTimer()
    timer.addAction(mouseTrack)
    timer.start(0.02, true)
}

TTargetingArea.addAction('START', (inst, pl, abil) => {enableDrawing(true, pl, abil)})
TTargetingArea.addAction('STOP', (inst, pl, abil) => {enableDrawing(false, pl, abil)})

function enableDrawing(flag: boolean, pl: jplayer, abil: IFace<[hUnit]>){
    if (pl != GetLocalPlayer()){return}
    
    cur_abil = flag ? abil : undefined
    Selection.lock(flag)

    circle.visible = flag
    if (flag){mouseTrack()}
}

function mouseTrack(this: void){
    if (!cur_abil){return}

    let [targ] = getTarget(GetLocalPlayer(), cur_abil)
    circle.setPolarPos(targ.x, targ.y, cur_abil.Data.area, 0, 2 * math.pi)
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
    
    if (r > abil.Data.range){
        let cos = dx / r
        let sin = dy / r
    
        let range = abil.Data.range
        end_x = range * cos + start_x
        end_y = range * sin + start_y
    }

    let res: [Point] = [new Point(end_x, end_y)]
    return res
}