import { Trigger } from "./Trigger";

export class TriggerEvent {
    private constructor(func: (this: void, trig: jtrigger, ...args: any[])=>jevent, ...args:any[]){
        this._func = func
        this._args = [...args]
    }

    static newVariableEvent(var_name: string, opcode: jlimitop, limitval: number){
        return new TriggerEvent(TriggerRegisterVariableEvent, var_name, opcode, limitval)
    }

    static newGameStateEvent(gamestate: jgamestate, opcode: jlimitop, limitval: number){
        return new TriggerEvent(TriggerRegisterGameStateEvent, gamestate, opcode, limitval)
    }

    static newDialogEvent(dialog: jdialog){
        return new TriggerEvent(TriggerRegisterDialogEvent, dialog)
    }

    static newDialogButtonEvent(button: jbutton){
        return new TriggerEvent(TriggerRegisterDialogButtonEvent, button)
    }

    static newGameEvent(gameevent: jgameevent){
        return new TriggerEvent(TriggerRegisterGameEvent, gameevent)
    }

    static newEnterRegion(region: jregion){
        return new TriggerEvent(TriggerRegisterEnterRegion, region)
    }

    static newLeaveRegion(region: jregion){
        return new TriggerEvent(TriggerRegisterLeaveRegion, region)
    }

    static newTrackableHitEvent(trackable: jtrackable){
        return new TriggerEvent(TriggerRegisterTrackableHitEvent, trackable)
    }

    static newTrackableTrackEvent(trackable: jtrackable){
        return new TriggerEvent(TriggerRegisterTrackableTrackEvent, trackable)
    }

    static newPlayerEvent(player: jplayer, playerevent: jplayerevent){
        return new TriggerEvent(TriggerRegisterPlayerEvent, player, playerevent)
    }

    static newPlayerUnitEvent(player: jplayer, playerunitevent: jplayerunitevent){
        return new TriggerEvent(TriggerRegisterPlayerUnitEvent, player, playerunitevent, null)
    }

    static newPlayerAllianceChange(player: jplayer, alliancetype: jalliancetype){
        return new TriggerEvent(TriggerRegisterPlayerAllianceChange, player, alliancetype)
    }

    static newPlayerStateEvent(player: jplayer, playerstate: jplayerstate, opcode: jlimitop, limitval: number){
        return new TriggerEvent(TriggerRegisterPlayerStateEvent, player, playerstate, opcode, limitval)
    }

    static newPlayerChatEvent(player: jplayer, message: string, exact_match: boolean){
        return new TriggerEvent(TriggerRegisterPlayerChatEvent, player, message, exact_match)
    }

    static newDeathEvent(widget: jwidget){
        return new TriggerEvent(TriggerRegisterDeathEvent, widget)
    }

    static newUnitStateEvent(unit: junit, unitstate: junitstate, opcode: jlimitop, limitval: number){
        return new TriggerEvent(TriggerRegisterUnitStateEvent, unit, unitstate, opcode, limitval)
    }

    static newUnitEvent(unitevent: junitevent, unit: junit){
        return new TriggerEvent(TriggerRegisterUnitEvent, unitevent, unit)
    }

    static newUnitInRange(unit: junit, range: number){
        return new TriggerEvent(TriggerRegisterUnitInRange, unit, range)
    }

    public applyToTrigger(trigger: Trigger){
        this._func(trigger.handle, ...this._args)
    }

    private _func: (this: void, trig: jtrigger, ...args: any[])=>jevent;
    private _args: any[];
}