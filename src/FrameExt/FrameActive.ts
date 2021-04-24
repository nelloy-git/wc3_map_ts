import { EventActions} from '../Utils'
import { Handle, hTrigger, hTriggerEvent } from "../Handle";
import { Fdf } from '../Fdf'

import { Frame } from './Frame'
import { jEvent, getEvent, getJEvent} from './FrameEvent'

export abstract class FrameActive extends Frame {
    static get(id: jframehandle | number){
        let instance = Handle.get(id, 'framehandle')
        if (instance instanceof FrameActive){
            return instance
        }
        return undefined
    }

    constructor(fdf: Fdf, is_simple: boolean,
                events: ReadonlyArray<FrameActive.Event>)
    constructor(handle: jframehandle, is_simple: boolean,
                events: ReadonlyArray<FrameActive.Event>)
    constructor(handle_or_fdf: jframehandle | Fdf, is_simple: boolean,
                events: ReadonlyArray<FrameActive.Event>)
    constructor(handle: jframehandle | Fdf, is_simple: boolean,
                events: ReadonlyArray<FrameActive.Event>){
                    
        super(handle, is_simple)

        this.actions = new EventActions(<FrameActive>this, this.toString())

        this.__events = []
        for (const event of events){
            // Register events in global trigger
            let trig_event = hTriggerEvent.newFrameEvent(this.handle, getJEvent(event))
            this.__events.push(trig_event)

            trig_event.applyToTrigger(FrameActive.__trigger)
        }
        FrameActive.__trigger_events.push(this.__events)
    }

    destroy(){
        // Remove events from global trigger
        FrameActive.__trigger_events.splice(FrameActive.__trigger_events.indexOf(this.__events), 1)
        FrameActive.__trigger.destroy()
        FrameActive.__trigger = FrameActive.__updateTrigger()

        super.destroy()
    }

    readonly actions: EventActions<FrameActive.Event, FrameActive, [jplayer]>

    private __events: hTriggerEvent<[jframehandle, jframeeventtype]>[]

    private static __runActions(this: void){
        let frame = FrameActive.get(BlzGetTriggerFrame())
        if (!frame){
            return
        }

        let event = getEvent(BlzGetTriggerFrameEvent())
        let pl = GetTriggerPlayer()

        FrameActive.Actions.run(event, frame, pl)
        frame.actions.run(event, pl)
    }

    private static __updateTrigger(){
        let t = new hTrigger()
        t.actions.add(FrameActive.__runActions)

        for (const frame_events of FrameActive.__trigger_events){
            for (let event of frame_events){
                event.applyToTrigger(t)
            }
        }
    
        return t
    }

    private static __trigger_events: hTriggerEvent<[jframehandle, jframeeventtype]>[][] = []
    private static __trigger = IsGame() ? FrameActive.__updateTrigger()
                                        : <hTrigger><unknown>undefined
}

export namespace FrameActive {
    export type Event = jEvent
    export const Actions = new EventActions<FrameActive.Event,
                                            typeof FrameActive,
                                            [FrameActive, jplayer]>(FrameActive, FrameActive.name)
}