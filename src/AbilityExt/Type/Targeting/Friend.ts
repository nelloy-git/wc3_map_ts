import * as WcIO from '../../../WcIO'
import * as Handle from '../../../Handle'
import * as Utils from '../../../Utils'

import { TTargeting } from '../Targeting'
import { IFace } from '../../Ability/IFace'

let __path__ = Macro(Utils.getFilePath())

export let TTargetingFriend = new TTargeting<Handle.hUnit[]>(getTarget)

const HIGHLIGHT = new Utils.Color(0.3, 1, 0.3, 1)

let cur_abil: IFace<Handle.hUnit[]> | undefined
let previous: Handle.hUnit | undefined
let prev_color = new Utils.Color(1, 1, 1, 1)

if (IsGame()){
    let timer = new Handle.hTimer()
    timer.addAction(mouseTrack)
    timer.start(0.02, true)
}

TTargetingFriend.addAction('START', (inst, pl, abil) => {startDrawing(pl, abil)})
TTargetingFriend.addAction('STOP', (inst, pl, abil) => {stopDrawing(pl, abil)})

function startDrawing(pl: jplayer, abil: IFace<Handle.hUnit[]>){
    if (pl != GetLocalPlayer()){return}
    
    cur_abil = abil
    WcIO.Selection.lock(true)
}

function stopDrawing(pl: jplayer, abil: IFace<Handle.hUnit[]>){
    if (pl != GetLocalPlayer()){return}

    cur_abil = undefined
    WcIO.Selection.lock(false)
            
    // Restore color if color has not been changed.
    if (previous && HIGHLIGHT.compare(previous.color)){
        previous.color = prev_color
    }
}

function mouseTrack(this: void){
    if (!cur_abil){return}

    let hovered = Handle.hUnit.getMouseFocus()
    let owner = cur_abil.Data.owner

    // Restore color if highlight color has not been changed.
    if (previous && previous != hovered &&
        HIGHLIGHT.compare(previous.color)){
        
        previous.color = prev_color
    }

    if (hovered && owner?.isAlly(hovered)){
        let color = hovered.color
        previous = hovered
        if (!color.compare(HIGHLIGHT)){
            prev_color = color
            hovered.color = HIGHLIGHT
        }
    } else {
        previous = undefined
        prev_color = new Utils.Color(1, 1, 1, 1)
    }
}

function getTarget(this: void, abil: IFace<Handle.hUnit[]>): Handle.hUnit[]{
    if (abil != cur_abil){
        return Utils.Log.err('getTarget error.',
                                __path__, TTargeting, 3)
    }

    let hovered = Handle.hUnit.getMouseFocus()
    return hovered ? [hovered] : []
}