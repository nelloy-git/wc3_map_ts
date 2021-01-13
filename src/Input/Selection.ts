import { Action, ActionList } from "../Utils"

export namespace Selection {
    export function lock(flag: boolean, pl?: jplayer){
        pl = pl ? pl : GetLocalPlayer()
        if (pl != GetLocalPlayer()){return}

        _lock = flag
        EnableSelect(!flag, true)
        EnableDragSelect(!flag, true)
        ClearSelection()

        let gr = _groups.get(pl)
        if (!gr){return}
        for (let u of gr){
            SelectUnit(u, true)
        }
    }

    export function addAction(callback: (this: void, pl: jplayer, gr: junit[])=>void){
        return _actions.add(callback)
    }

    export function removeAction(action: Action<[jplayer, junit[]], void>){
        return _actions.remove(action)
    }

    let _actions = new ActionList<[jplayer, junit[]]>()

    function _runActios(pl: jplayer, event: 'SELECT' | 'DESELECT'){
        let u = GetTriggerUnit()
        let gr = _groups.get(pl)
        if (!gr || !u){return}

        let found = gr.indexOf(u)

        if (_lock){
            if (found < 0 && pl == GetLocalPlayer()){
                SelectUnit(u, event == 'DESELECT')
            }
        } else {
            if (event == 'SELECT' && found < 0){
                gr.push(u)
                _actions.run(pl, Object.assign([], gr))
            } else if (event == 'DESELECT' && found >= 0){
                gr.splice(found, 1)
                _actions.run(pl, Object.assign([], gr))
            }
        }
    }

    function _checkDied(this: void){
        let u = GetTriggerUnit()

        for (let [pl, gr] of _groups){
            if (gr.indexOf(u) >= 0){_runActios(pl, 'DESELECT')}
        }
    }

    let _lock = false
    let _groups = new Map<jplayer, junit[]>()
    let _trigger_select: jtrigger | undefined
    let _trigger_deselect: jtrigger | undefined
    let _trigger_died: jtrigger | undefined
    if (IsGame()){
        _trigger_select = CreateTrigger()
        _trigger_deselect = CreateTrigger()
        _trigger_died = CreateTrigger()
        TriggerAddAction(_trigger_select, (() => {_runActios(GetTriggerPlayer(), 'SELECT')}))
        TriggerAddAction(_trigger_deselect, (() => {_runActios(GetTriggerPlayer(), 'DESELECT')}))
        TriggerAddAction(_trigger_died, _checkDied)

        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
            let pl = Player(i)
            if (GetPlayerController(pl) == MAP_CONTROL_USER &&
                GetPlayerSlotState(pl) == PLAYER_SLOT_STATE_PLAYING){

                _groups.set(pl, [])
                TriggerRegisterPlayerUnitEvent(_trigger_select, pl, EVENT_PLAYER_UNIT_SELECTED)
                TriggerRegisterPlayerUnitEvent(_trigger_deselect, pl, EVENT_PLAYER_UNIT_DESELECTED)
                TriggerRegisterPlayerUnitEvent(_trigger_died, pl, EVENT_PLAYER_UNIT_DEATH)
            } 
        }
    }
}