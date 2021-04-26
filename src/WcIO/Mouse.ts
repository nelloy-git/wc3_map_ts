import { Vec2 } from '../Math'
import { EventActions } from "../../src/Utils"
import { hTimer, hTrigger, hTriggerEvent } from '../Handle'

export class Mouse {
    private constructor(){}
}

export namespace Mouse {
    export type Event = 'UP' | 'DOWN'

    export const actions = new EventActions<Mouse.Event,
                                            [pl: jplayer]>
                                            (Mouse.name)

    export function pos(pl: jplayer){
        let pos = __pos.get(pl)
        if (!pos){
            return new Vec2(0, 0)
        }
        return pos[0].copy()
    }

    // Filter for smooth moving
    const __pos = new Map<jplayer, [cur: Vec2, next: Vec2]>()
    if (IsGame()){
        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
            let pl = Player(i)
            let is_human = GetPlayerController(pl) == MAP_CONTROL_USER &&
                           GetPlayerSlotState(pl) == PLAYER_SLOT_STATE_PLAYING

            if (is_human){
                __pos.set(pl, [new Vec2(0, 0), new Vec2(0, 0)])
            }
        }

        let t = new hTimer()
        t.actions.add(() => {
            for (let [pl, data] of __pos){
                let [cur, next] = data
                data[0] = cur.add(next.sub(cur).mult(0.3))
            }
        })
        t.start(0.03, true)
    }

    function __setNextPos(pl: jplayer){
        let pl_pos = __pos.get(pl)
        if (!pl_pos){
            return
        }
    
        pl_pos[1] = new Vec2(BlzGetTriggerPlayerMouseX(),
                             BlzGetTriggerPlayerMouseY())
    }

    function __runActions(event?: Event){
        let pl = GetTriggerPlayer()
        __setNextPos(pl)

        if (event){
            actions.run(event, pl)
        }
    }

    if(IsGame()){
        let tr = {
            DOWN: new hTrigger(),
            UP: new hTrigger(),
            MOVE: new hTrigger(),
        }

        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
            let pl = Player(i)
            let is_human = GetPlayerController(pl) == MAP_CONTROL_USER &&
                           GetPlayerSlotState(pl) == PLAYER_SLOT_STATE_PLAYING

            if (is_human){
                hTriggerEvent.newPlayerEvent(pl, EVENT_PLAYER_MOUSE_DOWN).applyToTrigger(tr['DOWN'])
                hTriggerEvent.newPlayerEvent(pl, EVENT_PLAYER_MOUSE_UP).applyToTrigger(tr['UP'])
                hTriggerEvent.newPlayerEvent(pl, EVENT_PLAYER_MOUSE_MOVE).applyToTrigger(tr['MOVE'])
            }
        }

        tr['DOWN'].actions.add(() => {__runActions('DOWN')})
        tr['UP'].actions.add(() => {__runActions('UP')})
        tr['MOVE'].actions.add(() => {__runActions()})
    }
}