import * as Fdf from "../Fdf";
import { hHandle, hTrigger, hTriggerEvent } from "../Handle";
import { Action, ActionList, Color, Log, wcType } from "../Utils";

export class Frame extends hHandle<jframehandle> {
    constructor(fdf: Fdf.Fdf)
    constructor(handle: jframehandle, is_simple: boolean)
    constructor(handle: jframehandle | Fdf.Fdf, is_simple?: boolean){
        is_simple = is_simple ? true : false

        if (handle instanceof Fdf.Fdf){
            let fdf = handle

            let name = fdf.name
            is_simple = fdf.is_simple
        
            handle = is_simple ? BlzCreateSimpleFrame(name, Frame._origin_game_ui as jframehandle, 0)
                               : BlzCreateFrame(name, Frame._origin_console_ui as jframehandle, 0, 0)
            let test_h = is_simple ? BlzCreateSimpleFrame('', Frame._origin_game_ui as jframehandle, 0)
                                   : BlzCreateFrame('', Frame._origin_console_ui as jframehandle, 0, 0)
        
            if (tostring(handle) == tostring(test_h)){
                Log.err(Frame.name +
                        ': can not create framehandle with name ' + name)
            }
            BlzDestroyFrame(test_h)
        }

        super(handle)
        this.isSimple = is_simple

        this._x = 0;
        this._y = 0;
        this._parent = null;
        this._children = [];
        this._visible = true;
        this._tooltip = null;
        this._is_tooltip = 0;
        this._level = 0;
        this._color = new Color(1, 1, 1, 1)
        this._enable = true;
        this._actions = new Map<Frame.Event, ActionList<[Frame, Frame.Event, jplayer]>>()
    }
    
    static get(id: jframehandle | number){
        let instance = hHandle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'framehandle'){
            Log.err('Frame: got wrong type of handle.', 2)
        }
        return <Frame>instance
    }
    static getTriggered(){return Frame.get(BlzGetTriggerFrame())}

    initEvents(events: Frame.Event[]){
        if (this._trig_events){
            Log.err(Frame.name + 
                    ': events are already initialized.')
        }

        if (!Frame._wc2event){
            return Log.err(Frame.name + 
                           ': static event list has not been initialized.')
        }
        
        if (!Frame._trigger){
            return Log.err(Frame.name + 
                           ': static event trigger has not been initialized.')
        }
        
        events.forEach(event => {
            if (this._actions.get(event) != undefined){
                Log.err(Frame.name + 
                        ': events in list can be used only once per type.')
            }
            this._actions.set(event, new ActionList())
        })

        this._trig_events = []
        for (let [wc_event, _] of Frame._wc2event){
            let trig_event = hTriggerEvent.newFrameEvent(this.handle, wc_event)
            this._trig_events.push(trig_event)
            
            Frame._trigger_events.push(trig_event)
            trig_event.applyToTrigger(Frame._trigger)
        }
    }

    /* _get_pos should be overriden instead. */
    get pos(): [x: number, y: number]{return this._get_pos()}
    /* _set_pos should be overriden instead. */
    set pos(pos: [x: number, y: number]){this._set_pos(pos)}

    get absPos(): [number, number]{
        let [parent_absX, parent_absY] = this._parent ? this._parent.absPos : [0, 0]
        return [parent_absX + this._x, parent_absY + this._y]
    }

    /* _get_size should be overriden instead. */
    get size():[w: number, h: number]{return this._get_size()}
    /* _set_size should be overriden instead. */
    set size(size: [w: number, h: number]){this._set_size(size)}

    /* _get_visible should be overriden instead. */
    get visible(){return this._get_visible()}
    /* _set_visible should be overriden instead. */
    set visible(flag: boolean){this._set_visible(flag)}

    get parent(){return this._parent}
    set parent(parent: Frame | null){
        if (this._parent){
            let i = this._parent._children.indexOf(this)
            this._parent._children.splice(i, 1)
        }

        this._parent = parent
        if (parent){
            parent._children.push(this)
        } 

        this.pos = this.pos
        this.visible = this.visible
    }
    get children(){return this._children as ReadonlyArray<Frame>}

    get tooltip(){return this._tooltip}
    set tooltip(tooltip: Frame | null){
        if (!this._actions.get('ENTER') || this._actions.get('LEAVE')){
            Log.err(Frame.name + 
                    ': frame can have tooltip.')
        }

        if (this._tooltip){
            this._is_tooltip -= 1

            this._actions.get('ENTER')?.remove(this._tooltip_show_action)
            this._actions.get('LEAVE')?.remove(this._tooltip_hide_action)
        }

        this._tooltip = tooltip
        if (tooltip){
            tooltip._is_tooltip += 1

            this._tooltip_show_action = this._actions.get('ENTER')?.add((_1, _2, pl: jplayer)=>{
                if (pl == GetLocalPlayer()){tooltip.visible = true}
            })
            this._tooltip_hide_action = this._actions.get('LEAVE')?.add((_1, _2, pl: jplayer)=>{
                if (pl == GetLocalPlayer()){tooltip.visible = false}
            })
            tooltip.visible = false
        }
    }
    get isTooltip(){return this._is_tooltip > 0}

    get level(){return this._level}
    set level(lvl: number){
        this._level = lvl
        BlzFrameSetLevel(this.handle, lvl)
    }

    get color(){return new Color(this._color)}
    set color(c: Color){
        this._color = new Color(c)
        BlzFrameSetVertexColor(this.handle, c.getWcCode())
        BlzFrameSetAlpha(this.handle, Math.floor(255 * c.a))
    }

    get enable(){return this._enable}
    set enable(flag: boolean){
        this._enable = flag
        BlzFrameSetEnable(this.handle, flag)
    }

    click(){
        BlzFrameClick(this.handle)
    }

    addAction(event: Frame.Event,
                     callback: (this: void,
                                frame: Frame,
                                event: Frame.Event,
                                pl: jplayer)=>void){
        let list = this._actions.get(event)
        if (!list){
            return Log.err(Frame.name + 
                           ': event \"' + event + '\" is not available for this frame.')
        }
        return list.add(callback)
    }

    removeAction(action: Action<[Frame, Frame.Event, jplayer], void>){
        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    destroy(){ 
        if (this._parent){
            let i = this._parent._children.indexOf(this)
            this._parent._children.splice(i, 1)
        }
        for (let i = 0; i < this._children.length; i++){
            this._children[i].parent = null
        }

        if (this._trig_events){
            for (let i = 0; i < this._trig_events.length; i++){
                let pos = Frame._trigger_events.indexOf(this._trig_events[i])
                this._trig_events.splice(pos, 1)
            }
            Frame._updateTrigger()
        }

        BlzDestroyFrame(this.handle)
        super.destroy()
    }

    protected _get_pos(): [x: number, y: number]{return [this._x, this._y]}
    protected _set_pos(pos: [x: number, y: number]){
        [this._x, this._y] = pos
        if (this._parent){
            BlzFrameSetPoint(this.handle, FRAMEPOINT_TOPLEFT,
                             this._parent.handle, FRAMEPOINT_TOPLEFT,
                             this._x, -this._y)
        } else {
            BlzFrameSetAbsPoint(this.handle, FRAMEPOINT_TOPLEFT,
                                this._x, 0.6 - this._y)
        }

        for (let i = 0; i < this._children.length; i++){
            this._children[0].pos = this._children[0].pos
        }
    }

    protected _get_size(): [w: number, h: number]{
        return [BlzFrameGetWidth(this.handle), BlzFrameGetHeight(this.handle)]
    }
    protected _set_size(size: [w: number, h: number]){
        BlzFrameSetSize(this.handle, size[0], size[1])
    }
    

    protected _get_visible(){return this._visible}
    protected _set_visible(flag: boolean){
        this._visible = flag
        BlzFrameSetVisible(this.handle, flag)
        for (let i = 0; i < this._children.length; i++){
            if (!this._children[i].isTooltip){
                this._children[i].visible = flag
            }
        }
    }

    readonly isSimple: boolean
    private _x: number
    private _y: number
    private _parent: Frame | null
    private _children: Frame[]
    private _visible: boolean
    private _tooltip: Frame | null
    private _is_tooltip: number
    private _tooltip_show_action: Action<[Frame, Frame.Event, jplayer], void> | undefined
    private _tooltip_hide_action: Action<[Frame, Frame.Event, jplayer], void> | undefined
    private _level: number
    private _color: Color
    private _enable: boolean

    private _trig_events: hTriggerEvent[] | undefined
    private _actions: Map<Frame.Event, ActionList<[Frame, Frame.Event, jplayer]>>

    private static readonly _origin_game_ui = IsGame() ? BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0) : undefined
    private static readonly _origin_console_ui = IsGame() ? (()=>{
        let h = BlzGetFrameByName("ConsoleUIBackdrop", 0)
        BlzFrameClearAllPoints(h)
        BlzFrameSetAbsPoint(h, FRAMEPOINT_BOTTOMLEFT, 0, 0.6)
        BlzFrameSetAbsPoint(h, FRAMEPOINT_BOTTOMRIGHT, 0, 0.6)
        BlzFrameSetAbsPoint(h, FRAMEPOINT_TOPLEFT, 0, 0.6)
        BlzFrameSetAbsPoint(h, FRAMEPOINT_TOPLEFT, 0, 0.6)
        return h
    })() : undefined

    private static _wc2event = IsGame() ? (()=>{
        return new Map<jframeeventtype, Frame.Event>([
            [FRAMEEVENT_CONTROL_CLICK, 'CLICK'],
            [FRAMEEVENT_MOUSE_DOUBLECLICK, 'DOUBLECLICK'],
            [FRAMEEVENT_MOUSE_DOWN, 'DOWN'],
            [FRAMEEVENT_MOUSE_ENTER, 'ENTER'],
            [FRAMEEVENT_MOUSE_LEAVE, 'LEAVE'],
            [FRAMEEVENT_MOUSE_UP, 'UP'],
            [FRAMEEVENT_MOUSE_WHEEL, 'WHEEL'],
        ])
    })() : undefined

    private static _runActions(this: void){
        let event = Frame._wc2event?.get(BlzGetTriggerFrameEvent())
        if (!event){return}
        let frame = Frame.getTriggered()
        if (!frame){return}

        let pl = GetTriggerPlayer()
        // Drop focus
        if (event == 'CLICK' && pl == GetLocalPlayer()){
            frame.enable = false
            frame.enable = true
        }

        frame._actions.get(event)?.run(frame, event, pl)
    }

    private static _updateTrigger(){
        Frame._trigger?.destroy()

        let t = new hTrigger()
        t.addAction(Frame._runActions)
        for (let i = 0; i < Frame._trigger_events.length; i++){
            Frame._trigger_events[i].applyToTrigger(t)
        }

        Frame._trigger = t
    }

    private static _trigger: hTrigger | undefined = IsGame() ? (()=>{
        let t = new hTrigger()
        t.addAction(Frame._runActions)
        return t
    })() : undefined;
    private static _trigger_events: hTriggerEvent[] = []
}

export namespace Frame {
    export type Event = 'ENTER'|'LEAVE'|'UP'|'DOWN'|'WHEEL'|'CLICK'|'DOUBLECLICK'
}