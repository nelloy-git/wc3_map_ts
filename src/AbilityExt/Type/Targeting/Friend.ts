import { Mouse, Selection } from '../../../Input'
import { hTimer, hUnit } from '../../../Handle'
import { Color, Log } from '../../../Utils'
import { TTargeting } from '../Targeting'
import { IFace } from '../../Ability/IFace'

export let TTargetingFriend = new TTargeting<hUnit[]>(getTarget)

let cur_abil: IFace<[hUnit]> | undefined
let previous: hUnit | undefined
let highlight: Color = new Color(0.3, 1, 0.3, 1)
let prev_color: Color = new Color(1, 1, 1, 1)

if (IsGame()){
    let timer = new hTimer()
    timer.addAction(mouseTrack)
    timer.start(0.02, true)
}

TTargetingFriend.addAction('START', (inst, pl, abil) => {startDrawing(pl, abil)})
TTargetingFriend.addAction('STOP', (inst, pl, abil) => {stopDrawing(pl, abil)})

function startDrawing(pl: jplayer, abil: IFace<[hUnit]>){
    if (pl != GetLocalPlayer()){return}
    
    cur_abil = abil
    Selection.lock(true)
}

function stopDrawing(pl: jplayer, abil: IFace<[hUnit]>){
    if (pl != GetLocalPlayer()){return}

    cur_abil = undefined
    Selection.lock(false)
            
    // Restore color if color has not been changed.
    if (previous && highlight.compare(previous.color)){
        previous.color = prev_color
    }
}

function mouseTrack(this: void){
    if (!cur_abil){return}

    let hovered = hUnit.getMouseFocus()
    let owner = cur_abil.Data.owner

    // Restore color if highlight color has not been changed.
    if (previous && previous != hovered &&
        highlight.compare(previous.color)){
        
        previous.color = prev_color
    }

    if (hovered && owner?.isAlly(hovered)){
        let color = hovered.color
        previous = hovered
        if (!color.compare(highlight)){
            prev_color = color
            hovered.color = highlight
        }
    } else {
        previous = undefined
        prev_color = new Color(1, 1, 1, 1)
    }
}

function getTarget(this: void, pl: jplayer, abil: IFace<(hUnit)[]>): hUnit[]{
    if (abil != cur_abil){
        return Log.err(TTargeting.name + 
                       ': getTarget error.')
    }

    let hovered = hUnit.getMouseFocus()
    return hovered ? [hovered] : []
}