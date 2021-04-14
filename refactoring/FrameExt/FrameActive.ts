import * as Fdf from '../Fdf'
import * as Handle from '../../src/Handle'
import * as Utils from '../../src/Utils'

import { Frame } from './Frame'

export abstract class FrameActive extends Frame {
    static get(id: jframehandle | number){
        let instance = Handle.Handle.get(id)
        if (instance instanceof FrameActive){
            return instance
        }
        return undefined
    }
    static getTriggered(){return FrameActive.get(BlzGetTriggerFrame())}

    constructor(fdf: Fdf.Fdf, is_simple: boolean,
                events: ReadonlyArray<jframeeventtype>)
    constructor(handle: jframehandle, is_simple: boolean,
                events: ReadonlyArray<jframeeventtype>)
    constructor(handle_or_fdf: jframehandle | Fdf.Fdf, is_simple: boolean,
                events: ReadonlyArray<jframeeventtype>)
    constructor(handle: jframehandle | Fdf.Fdf, is_simple: boolean,
                events: ReadonlyArray<jframeeventtype>){
                    
        super(handle, is_simple)

        this.__actions = new Map()
        this.__events = []
        for (const event of events){
            this.__actions.set(event, new Utils.ActionList())

            // Register events in global trigger
            let trig_event = Handle.hTriggerEvent.newFrameEvent(this.handle, event)
            trig_event.applyToTrigger(__trigger)
            this.__events.push(trig_event)
        }
    }

    destroy(){
        // Remove events from global trigger
        __trigger_events.splice(__trigger_events.indexOf(this.__events), 1)
        __trigger.destroy()
        __trigger = __triggerUpdated()

        super.destroy()
    }

    addAction(event: jframeeventtype, callback: FrameActive.Callback){
        let list = this.__actions.get(event)
        return list ? list.add(callback) : undefined
    }

    removeAction(action: FrameActive.Action){
        let found = false
        for (let [_, list] of this.__actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    runActions(event: jframeeventtype, pl: jplayer){
        let list = this.__actions.get(event)
        if (list){
            list.run(this, event, pl)
        }
    }

    private __actions: Map<jframeeventtype, Utils.ActionList<[FrameActive, jframeeventtype, jplayer]>>
    private __events: Handle.hTriggerEvent[]
}

export namespace FrameActive {
    export type Callback = (this: void, frame: FrameActive, event: jframeeventtype, pl: jplayer)=>void
    export type Action = Utils.Action<[FrameActive, jframeeventtype, jplayer], void>
}

function __triggerAction(this: void){
    let frame = FrameActive.getTriggered()
    if (!frame){return}

    let jevent = BlzGetTriggerFrameEvent()
    let pl = GetTriggerPlayer()

    // Drop focus
    if (jevent == FRAMEEVENT_CONTROL_CLICK && pl == GetLocalPlayer()){
        frame.enable = false
        frame.enable = true
    }

    frame.runActions(jevent, pl)
}
let __trigger_events: Handle.hTriggerEvent[][] = []

function __triggerUpdated(){
    if (!IsGame()){return <Handle.hTrigger><unknown>undefined}

    let t = new Handle.hTrigger()
    t.addAction(__triggerAction)
    for (const frame_events of __trigger_events){
        for (let event of frame_events){
            event.applyToTrigger(t)
        }
    }

    return t
}

let __trigger = __triggerUpdated()