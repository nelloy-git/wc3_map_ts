import { Action, ActionList, EventActionsMap } from "../../src/Utils"
import { hTrigger, hTriggerEvent, hUnit } from "../Handle"

export class Selection {
    private constructor(){}
}

export namespace Selection {
    export type Event = 'SELECT' | 'DESELECT'

    export function lock(flag: boolean, pl: jplayer){
        if (pl != GetLocalPlayer()){
            return
        }

        __lock = flag
        EnableSelect(!flag, true)
        EnableDragSelect(!flag, true)
        ClearSelection()

        let gr = __groups.get(pl)
        if (!gr){return}
        for (let u of gr){
            SelectUnit(u.handle, true)
        }
    }

    export const actions = new EventActionsMap<jplayer,
                                               Selection.Event,
                                               typeof Selection,
                                               [pl: jplayer, group: hUnit[]]>(Selection, Selection.name)

    function __runActios(event: Selection.Event, pl: jplayer, u: hUnit){
        let gr = __groups.get(pl)
        if (!gr){
            return
        }

        let found = gr.indexOf(u)

        if (__lock){
            if (found < 0 && pl == GetLocalPlayer()){
                SelectUnit(u.handle, event == 'DESELECT')
            }
        } else {
            if (found < 0 && event == 'SELECT'){
                gr.push(u)
            } else if (found >= 0 && event == 'DESELECT'){
                gr.splice(found, 1)
            }
            let gr_copy = Object.assign([], gr)
            actions.run(pl, event, pl, gr_copy)
        }
    }

    function __checkDied(u: hUnit){
        for (let [pl, gr] of __groups){
            if (gr.indexOf(u) >= 0){
                __runActios('DESELECT', pl, u)
            }
        }
    }

    hUnit.ActionAny.add('SELECTED', (_, event, u) => {
        let pl = GetTriggerPlayer()
        __runActios('SELECT', pl, u)
    })

    hUnit.ActionAny.add('DESELECTED', (_, event, u) => {
        let pl = GetTriggerPlayer()
        __runActios('DESELECT', pl, u)
    })

    hUnit.ActionAny.add('DEATH', (_, event, u) => {
        __checkDied(u)
    })

    let __lock = false
    let __groups = new Map<jplayer, hUnit[]>()
}