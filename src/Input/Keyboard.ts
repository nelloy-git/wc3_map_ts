import { Action, ActionList, Log } from '../Utils'
import { KeyboardKeys } from './KeyboardKeys'

export namespace Keyboard {

    export function addAction(callback: (this: void, pl: jplayer, key: joskeytype, meta: number, is_down: boolean)=>void){
        return _actions.add(callback)
    }

    export function removeAction(action: Action<[jplayer, joskeytype, number, boolean], void>){
        return _actions.remove(action)
    }

    function _runActios(this: void){
        _actions.run(GetTriggerPlayer(),
                     BlzGetTriggerPlayerKey(),
                     BlzGetTriggerPlayerMetaKey(),
                     BlzGetTriggerPlayerIsKeyDown())
    }

    let _actions = new ActionList<[jplayer, joskeytype, number, boolean]>()

    let _trigger: jtrigger | undefined
    if (IsGame()){
        _trigger = CreateTrigger()
        TriggerAddAction(_trigger, _runActios)

        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
            let pl = Player(i)
            if (GetPlayerController(pl) == MAP_CONTROL_USER &&
                GetPlayerSlotState(pl) == PLAYER_SLOT_STATE_PLAYING){

                for (let meta = 0; meta < 16; meta++){
                    for (let i = 0; i < KeyboardKeys.length; i++){
                        let key = KeyboardKeys[i]
                        BlzTriggerRegisterPlayerKeyEvent(_trigger, pl, key, meta, true)
                        BlzTriggerRegisterPlayerKeyEvent(_trigger, pl, key, meta, false)
                    }
                }
            } 
        }
    }
}