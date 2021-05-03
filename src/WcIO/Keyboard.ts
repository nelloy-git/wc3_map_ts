import { hTrigger, hTriggerEvent } from '../Handle'
import { EventActionsMap } from '../Utils'

import { KeyboardKeys, keyToString as k2s } from './Utils/KeyboardKeys'

export class Keyboard {
    private constructor(){}
}

export namespace Keyboard {
    export type Event = 'UP' | 'DOWN'

    export const actions = new EventActionsMap<joskeytype,
                                               Keyboard.Event,
                                               [pl: jplayer, key: joskeytype, meta: number]>
                                               (Keyboard.name)

    export const keyToString = k2s

    const __was_down = new Map<jplayer, Map<joskeytype, boolean>>()

    function __runActions(){
        let is_down = BlzGetTriggerPlayerIsKeyDown()
        let pl = GetTriggerPlayer()
        let key = BlzGetTriggerPlayerKey()
        let meta = BlzGetTriggerPlayerMetaKey()

        let pl_was_down = (<Map<joskeytype, boolean>>__was_down.get(pl))
        let was_down = (<boolean>pl_was_down.get(key))

        if (is_down != was_down){
            pl_was_down.set(key, is_down)
            actions.run(key, is_down ? 'DOWN' : 'UP', pl, key, meta)
        }
    }
                                          
    // Create triggers
    if (IsGame()){
        let tr = new hTrigger()
        tr.actions.add(__runActions)

        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
            let pl = Player(i)
            let is_human = GetPlayerController(pl) == MAP_CONTROL_USER &&
                           GetPlayerSlotState(pl) == PLAYER_SLOT_STATE_PLAYING
            
            if (is_human){
                for (let meta = 0; meta < 16; meta++){
                    for (const key of KeyboardKeys){
                        hTriggerEvent.newPlayerKeyEvent(pl, key, meta, true).applyToTrigger(tr)
                        hTriggerEvent.newPlayerKeyEvent(pl, key, meta, false).applyToTrigger(tr)
                    }
                }
                __was_down.set(pl, new Map())
            }
        } 
    }
}