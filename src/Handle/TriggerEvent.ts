import { hTrigger } from "./Trigger";

export class hTriggerEvent<T extends any[]> {

    static newVariableEvent(var_name: string, opcode: jlimitop, limitval: number){
        return new hTriggerEvent(TriggerRegisterVariableEvent, var_name, opcode, limitval)
    }

    static newGameStateEvent(gamestate: jgamestate, opcode: jlimitop, limitval: number){
        return new hTriggerEvent(TriggerRegisterGameStateEvent, gamestate, opcode, limitval)
    }

    static newDialogEvent(dialog: jdialog){
        return new hTriggerEvent(TriggerRegisterDialogEvent, dialog)
    }

    static newDialogButtonEvent(button: jbutton){
        return new hTriggerEvent(TriggerRegisterDialogButtonEvent, button)
    }

    static newGameEvent(gameevent: jgameevent){
        return new hTriggerEvent(TriggerRegisterGameEvent, gameevent)
    }

    static newEnterRegion(region: jregion){
        return new hTriggerEvent(TriggerRegisterEnterRegion, region)
    }

    static newFrameEvent(frame: jframehandle, event: jframeeventtype){
        return new hTriggerEvent(BlzTriggerRegisterFrameEvent, frame, event)
    }

    static newLeaveRegion(region: jregion){
        return new hTriggerEvent(TriggerRegisterLeaveRegion, region)
    }

    static newTrackableHitEvent(trackable: jtrackable){
        return new hTriggerEvent(TriggerRegisterTrackableHitEvent, trackable)
    }

    static newTrackableTrackEvent(trackable: jtrackable){
        return new hTriggerEvent(TriggerRegisterTrackableTrackEvent, trackable)
    }

    static newPlayerEvent(player: jplayer, playerevent: jplayerevent){
        return new hTriggerEvent(TriggerRegisterPlayerEvent, player, playerevent)
    }

    static newPlayerUnitEvent(player: jplayer, playerunitevent: jplayerunitevent){
        return new hTriggerEvent(TriggerRegisterPlayerUnitEvent, player, playerunitevent)
    }

    static newPlayerKeyEvent(player: jplayer, key: joskeytype, meta: number, is_down: boolean){
        return new hTriggerEvent(BlzTriggerRegisterPlayerKeyEvent, player, key, meta, is_down)
    }

    static newPlayerSyncEvent(pl: jplayer, prefix: string, from_server: boolean){
        return new hTriggerEvent(BlzTriggerRegisterPlayerSyncEvent, pl, prefix, from_server)
    }

    static newPlayerAllianceChange(player: jplayer, alliancetype: jalliancetype){
        return new hTriggerEvent(TriggerRegisterPlayerAllianceChange, player, alliancetype)
    }

    static newPlayerStateEvent(player: jplayer, playerstate: jplayerstate, opcode: jlimitop, limitval: number){
        return new hTriggerEvent(TriggerRegisterPlayerStateEvent, player, playerstate, opcode, limitval)
    }

    static newPlayerChatEvent(player: jplayer, message: string, exact_match: boolean){
        return new hTriggerEvent(TriggerRegisterPlayerChatEvent, player, message, exact_match)
    }

    static newDeathEvent(widget: jwidget){
        return new hTriggerEvent(TriggerRegisterDeathEvent, widget)
    }

    static newUnitStateEvent(unit: junit, unitstate: junitstate, opcode: jlimitop, limitval: number){
        return new hTriggerEvent(TriggerRegisterUnitStateEvent, unit, unitstate, opcode, limitval)
    }

    static newUnitEvent(unitevent: junitevent, unit: junit){
        return new hTriggerEvent(TriggerRegisterUnitEvent, unit, unitevent)
    }

    static newUnitInRange(unit: junit, range: number){
        return new hTriggerEvent(TriggerRegisterUnitInRange, unit, range)
    }

    public applyToTrigger(trigger: hTrigger){
        this.__func(trigger.handle, ...this.__args)
    }

    private __func: (this: void, trig: jtrigger, ...args: T)=>jevent;
    private __args: [...T];
    
    private constructor(func: (this: void, trig: jtrigger, ...args: T)=>jevent, ...args: T){
        this.__func = func
        this.__args = [...args]
    }
}