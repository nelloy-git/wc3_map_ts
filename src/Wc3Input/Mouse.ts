import { Action, ActionList } from "../Wc3Utils/index"

type MouseEvent = 'DOWN' | 'MOVE' | 'UP'

export namespace Mouse {

    export function getX(pl?: jplayer){
        if (!pl){pl = GetLocalPlayer()}
        let poses = _pos.get(pl)
        if (!poses){return 0}
        return poses[0][0]
    }

    export function getY(pl?: jplayer){
        if (!pl){pl = GetLocalPlayer()}
        let poses = _pos.get(pl)
        if (!poses){return 0}
        return poses[0][1]
    }

    export function addAction(event: MouseEvent,
                              callback: (this:void, event: MouseEvent, pl:jplayer, btn:jmousebuttontype)=>void){
        return _actions.get(event)?.add(callback)
    }

    export function removeAction(action: Action<[MouseEvent, jplayer, jmousebuttontype], void>){
        let found = false
        for (let [event, list] of _actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    let _pos = new Map<jplayer, [cur: [number, number], next: [number, number]]>()
    if (IsGame()){
        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
            let pl = Player(i)
            if (GetPlayerController(pl) == MAP_CONTROL_USER &&
                GetPlayerSlotState(pl) == PLAYER_SLOT_STATE_PLAYING){

                _pos.set(pl, [[0, 0], [0, 0]])
            }
        }
    }

    let _actions = new Map<MouseEvent, ActionList<[MouseEvent, jplayer, jmousebuttontype]>>([
        ['DOWN', new ActionList()],
        ['MOVE', new ActionList()],
        ['UP', new ActionList()],
    ])

    function _lerp(a: number, b: number, k: number){
        return a + (b - a) * k
    }
    function _onLoop(this: void){
        for (let [pl, [cur, next]] of _pos){
            cur[0] = _lerp(cur[0], next[0], 0.3)
            cur[1] = _lerp(cur[1], next[1], 0.3)
        }
    }

    let _timer = IsGame() ? CreateTimer() : undefined
    if (_timer){TimerStart(_timer, 0.03, true, _onLoop)}

    let _triggers = IsGame() ? new Map<MouseEvent, jtrigger>([
        ['DOWN', CreateTrigger()],
        ['MOVE', CreateTrigger()],
        ['UP', CreateTrigger()]
    ]) : undefined

    function _setNext(){
        let pl = GetTriggerPlayer()
        let poses = _pos.get(pl)
        if (!poses){return}
    
        let [cur, next] = poses
        next[0] = BlzGetTriggerPlayerMouseX()
        next[1] = BlzGetTriggerPlayerMouseY()
    }

    function _runActions(event: MouseEvent){
        _setNext()
        _actions.get(event)?.run(event,
                                 GetTriggerPlayer(),
                                 BlzGetTriggerPlayerMouseButton())
    }

    if(IsGame()){
        let down_trig = _triggers?.get('DOWN') as jtrigger
        let move_trig = _triggers?.get('MOVE') as jtrigger
        let up_trig = _triggers?.get('UP') as jtrigger

        TriggerAddAction(down_trig, ():void => {_runActions('DOWN')})
        TriggerAddAction(down_trig, ():void => {_runActions('MOVE')})
        TriggerAddAction(down_trig, ():void => {_runActions('UP')})

        for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++){
            let pl = Player(i)
            if (GetPlayerController(pl) == MAP_CONTROL_USER &&
                GetPlayerSlotState(pl) == PLAYER_SLOT_STATE_PLAYING){

                TriggerRegisterPlayerEvent(down_trig, pl, EVENT_PLAYER_MOUSE_DOWN)
                TriggerRegisterPlayerEvent(move_trig, pl, EVENT_PLAYER_MOUSE_MOVE)
                TriggerRegisterPlayerEvent(up_trig, pl, EVENT_PLAYER_MOUSE_UP)
            }
        }
    }
}