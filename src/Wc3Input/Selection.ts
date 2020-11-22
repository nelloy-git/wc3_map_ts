import { Action, ActionList } from "../Wc3Utils/index"

export namespace Selection {
    export function lock(flag: boolean, pl: jplayer|undefined){
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

    function _runActios(event: 'SELECT' | 'DESELECT'){
        let pl = GetTriggerPlayer()
        let u = GetTriggerUnit()
        let gr = _groups.get(pl)
        if (!gr || !u){return}

        let found = gr.findIndex((cur: junit, i:number, gr: junit[]): boolean => {return cur == u})

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

    let _lock = false
    let _groups = new Map<jplayer, junit[]>()
    let _trigger_select: jtrigger | undefined
    let _trigger_deselect: jtrigger | undefined
    if (IsGame()){
        _trigger_select = CreateTrigger()
        _trigger_deselect = CreateTrigger()
        TriggerAddAction(_trigger_select, (():void => {_runActios('SELECT')}))
        TriggerAddAction(_trigger_deselect, (():void => {_runActios('DESELECT')}))

        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
            let pl = Player(i)
            if (GetPlayerController(pl) == MAP_CONTROL_USER &&
                GetPlayerSlotState(pl) == PLAYER_SLOT_STATE_PLAYING){

                _groups.set(pl, [])
                TriggerRegisterPlayerUnitEvent(_trigger_select, pl, EVENT_PLAYER_UNIT_SELECTED)
                TriggerRegisterPlayerUnitEvent(_trigger_deselect, pl, EVENT_PLAYER_UNIT_DESELECTED)
            } 
        }
    }
}