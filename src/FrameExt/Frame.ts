import { Handle, Trigger, TriggerEvent } from "../Handle";
import { Action, ActionList, Color, Log, wcType } from "../Utils";
import { Fdf } from "./Fdf";

export class Frame extends Handle<jframehandle> {
    constructor(fdf: Fdf)
    constructor(handle: jframehandle, is_simple: boolean)
    constructor(handle: jframehandle | Fdf, is_simple?: boolean){
        super(Frame.createFramehandle(handle, is_simple))
        this.isSimple = (typeof is_simple === 'boolean') ? is_simple : (handle as Fdf).is_simple

        if (!Frame._wc2event){return}
        for (let [wc_event, _] of Frame._wc2event){
            let trig_event = TriggerEvent.newFrameEvent(this.handle, wc_event)
            Frame._trigger_events.push(trig_event)
            this._events.push(trig_event)
            if(Frame._trigger){trig_event.applyToTrigger(Frame._trigger)}
        }
    }
    
    public static get(id: jframehandle | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'framehandle'){
            Log.err('Frame: got wrong type of handle.', 2)
        }
        return <Frame>instance
    }
    public static getTriggered(){return Frame.get(BlzGetTriggerFrame())}

    public get pos(){return this._get_pos()}
    public set pos(pos: [x: number, y: number]){this._set_pos(pos)}

    public get absPos(): [number, number]{
        let [parent_absX, parent_absY] = this._parent ? this._parent.absPos : [0, 0]
        return [parent_absX + this._x, parent_absY + this._y]
    }

    public get size():[w: number, h: number]{return this._get_size()}
    public set size(size: [w: number, h: number]){this._set_size(size)}

    public get parent(){return this._parent}
    public set parent(parent: Frame | null){
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

    public get visible(){return this._visible}
    public set visible(flag: boolean){
        this._visible = flag
        BlzFrameSetVisible(this.handle, flag)
        for (let i = 0; i < this._children.length; i++){
            if (!this._children[i].isTooltip){
                this._children[i].visible = flag
            }
        }
    }

    public get tooltip(){return this._tooltip}
    public set tooltip(tooltip: Frame | null){
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
    public get isTooltip(){return this._is_tooltip > 0}

    public get level(){return this._level}
    public set level(lvl: number){
        this._level = lvl
        BlzFrameSetLevel(this.handle, lvl)
    }

    public get color(){return new Color(this._color)}
    public set color(c: Color){
        this._color = new Color(c)
        BlzFrameSetVertexColor(this.handle, c.getWcCode())
    }

    public get alpha(){return this._color.a}
    public set alpha(a: number){
        this._color.a = a
        BlzFrameSetAlpha(this.handle, Math.floor(255 * a))
    }

    public get enable(){return this._enable}
    public set enable(flag: boolean){
        this._enable = flag
        BlzFrameSetEnable(this.handle, flag)
    }

    public addAction(event: Frame.Event,
                     callback: (this: void,
                                frame: Frame,
                                event: Frame.Event,
                                pl: jplayer)=>void){
        return this._actions.get(event)?.add(callback)
    }

    public removeAction(action: Action<[Frame, Frame.Event, jplayer], void>){
        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    destroy(){
        super.destroy()

        if (this._parent){
            let i = this._parent._children.indexOf(this)
            this._parent._children.splice(i, 1)
        }

        for (let i = 0; i < this._children.length; i++){
            this._children[i].parent = null
        }

        for (let i = 0; i < this._events.length; i++){
            let pos = Frame._trigger_events.indexOf(this._events[i])
            this._events.splice(pos, 1)
        }
        Frame._updateTrigger()

        BlzDestroyFrame(this.handle)
    }

    protected get _get_pos(){return (): [x: number, y: number] => {
        return [this._x, this._y]
    }}
    protected get _set_pos(){return (pos: [x: number, y: number]) => {
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
    }}

    protected get _get_size(){return (): [x: number, y: number] => {
        return [BlzFrameGetWidth(this.handle), BlzFrameGetHeight(this.handle)]
    }}
    protected get _set_size(){return (size: [w: number, h: number]) =>{
        BlzFrameSetSize(this.handle, size[0], size[1])
    }}

    readonly isSimple: boolean;
    private _x: number = 0;
    private _y: number = 0;
    private _parent: Frame | null = null;
    private _children: Frame[] = [];
    private _visible: boolean = true;
    private _tooltip: Frame | null = null;
    private _is_tooltip: number = 0;
    private _tooltip_show_action: Action<[Frame, Frame.Event, jplayer], void> | undefined;
    private _tooltip_hide_action: Action<[Frame, Frame.Event, jplayer], void> | undefined;
    private _level: number = 0;
    private _color: Color = new Color(1, 1, 1, 1)
    private _enable: boolean = true;

    private _events: TriggerEvent[] = []
    private _actions = new Map<Frame.Event, ActionList<[Frame, Frame.Event, jplayer]>>([
        ['CLICK',      new ActionList()],
        ['DOUBLECLICK',new ActionList()],
        ['DOWN',       new ActionList()],
        ['ENTER',      new ActionList()],
        ['LEAVE',      new ActionList()],
        ['UP',         new ActionList()],
        ['WHEEL',      new ActionList()],
    ])

    private static createFramehandle(handle: jframehandle | Fdf, is_simple?: boolean){
        if (!(handle instanceof Fdf)){return handle}

        let name = handle.name
        is_simple = handle.is_simple
    
        handle = is_simple ?
                    BlzCreateSimpleFrame(name, Frame._origin_game_ui as jframehandle, 0)
                    : BlzCreateFrame(name, Frame._console_ui_backdrop as jframehandle, 0, 0)
        let test_h = is_simple ? 
                        BlzCreateSimpleFrame('', Frame._origin_game_ui as jframehandle, 0)
                        : BlzCreateFrame('', Frame._console_ui_backdrop as jframehandle, 0, 0)
    
        if (tostring(handle) == tostring(test_h)){
            return Log.err(Frame.name +
                           ': can not create framehandle with name ' + name)
        }
        BlzDestroyFrame(test_h)
        return handle
    }

    private static readonly _origin_game_ui = (()=>{
        if (!IsGame()){return}

        return BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)
    })()

    private static readonly _console_ui_backdrop = (()=>{
        if (!IsGame()){return}

        let h = BlzGetFrameByName("ConsoleUIBackdrop", 0)
        BlzFrameClearAllPoints(h)
        BlzFrameSetAbsPoint(h, FRAMEPOINT_BOTTOMLEFT, 0, 0.6)
        BlzFrameSetAbsPoint(h, FRAMEPOINT_BOTTOMRIGHT, 0, 0.6)
        BlzFrameSetAbsPoint(h, FRAMEPOINT_TOPLEFT, 0, 0.6)
        BlzFrameSetAbsPoint(h, FRAMEPOINT_TOPLEFT, 0, 0.6)
        return h
    })()

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

        let t = new Trigger()
        t.addAction(Frame._runActions)
        for (let i = 0; i < Frame._trigger_events.length; i++){
            Frame._trigger_events[i].applyToTrigger(t)
        }

        Frame._trigger = t
    }

    private static _trigger: Trigger | undefined = IsGame() ? (()=>{
        let t = new Trigger()
        t.addAction(Frame._runActions)
        return t
    })() : undefined;
    private static _trigger_events: TriggerEvent[] = []
}

export namespace Frame {
    export type Event = 'ENTER'|'LEAVE'|'UP'|'DOWN'|'WHEEL'|'CLICK'|'DOUBLECLICK'
}