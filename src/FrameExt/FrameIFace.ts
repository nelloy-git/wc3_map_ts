import { Vec2 } from '../Math'
import { Handle } from '../Handle'
import { Color } from '../Utils'
import { Fdf } from '../Fdf'

export abstract class FrameIFace extends Handle<jframehandle> {
    static get(id: jframehandle | number){
        let instance = Handle.get(id, 'framehandle')
        if (instance instanceof FrameIFace){
            return instance
        }
        return undefined
    }

    /** @tupleReturn */
    protected static _fromFdf(fdf: Fdf): [handle: jframehandle, is_simple: boolean]{
        let name = fdf.name
        let is_simple = fdf.is_simple
    
        let handle = is_simple ?
            BlzCreateSimpleFrame(name, FrameIFace.__origin_game_ui as jframehandle, 0)
            : BlzCreateFrame(name, FrameIFace.__origin_console_ui as jframehandle, 0, 0)
            
        let test_h = is_simple ?
            BlzCreateSimpleFrame('', FrameIFace.__origin_game_ui as jframehandle, 0)
            : BlzCreateFrame('', FrameIFace.__origin_console_ui as jframehandle, 0, 0)
    
        if (tostring(handle) == tostring(test_h)){
            error(FrameIFace.name + ': can not create framehandle with name "' + name + '"', 2)
        }
        BlzDestroyFrame(test_h)

        return [handle, is_simple]
    }

    constructor(handle: jframehandle, is_simple: boolean){
        super(handle)
        this.is_simple = is_simple
    }

    destroy(){
        let par = this._get_parent()
        
        if (par){
            par._get_children().splice(par._get_children().indexOf(this), 1)
        }
        
        for (let child of this._get_children()){
            child._set_parent(undefined)
        }

        BlzDestroyFrame(this.handle)
        super.destroy()
    }
    
    readonly is_simple: boolean

    get x(){return this._get_pos().x}
    set x(x: number){
        let p = this._get_pos()
        this._set_pos(new Vec2(x, p.y))
    }
    
    get y(){return this._get_pos().y}
    set y(y: number){
        let p = this._get_pos()
        this._set_pos(new Vec2(p.x, y))
    }

    get pos(){return this._get_pos()}
    set pos(p: Vec2){this._set_pos(p)}
    get abs_pos(): Vec2{
        let p = this._get_parent()
        return p ? p.abs_pos.add(this.pos): this.pos.copy()
    }

    get width(){return this._get_size().x}
    set width(w: number){
        let s = this._get_size()
        this._set_size(new Vec2(w, s.y))
    }

    get height(){return this._get_size().y}
    set height(h: number){
        let s = this._get_size()
        this._set_size(new Vec2(s.x, h))
    }

    get size(){return this._get_size()}
    set size(s: Vec2){this._set_size(s)}

    get visible(){return this._get_visible()}
    set visible(v: boolean){this._set_visible(v)}

    get enable(){return this._get_enable()}
    set enable(v: boolean){this._set_enable(v)}

    get level(){return this._get_level()}
    set level(v: number){this._set_level(v)}

    get color(){return this._get_color()}
    set color(c: Color){this._set_color(c)}

    protected abstract _get_pos(): Vec2
    protected abstract _set_pos(v: Vec2): void

    protected abstract _get_size(): Vec2
    protected abstract _set_size(v: Vec2): void

    protected abstract _get_visible(): boolean
    protected abstract _set_visible(f: boolean): void

    protected abstract _get_enable(): boolean
    protected abstract _set_enable(f: boolean): void

    protected abstract _get_parent(): FrameIFace | undefined
    protected abstract _set_parent(p: FrameIFace | undefined): void
    protected abstract _get_children(): FrameIFace[]

    protected abstract _get_level(): number
    protected abstract _set_level(l: number): void

    protected abstract _get_color(): Color
    protected abstract _set_color(c: Color): void

    private static readonly __origin_game_ui = IsGame() ?
        BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)
        : <jframehandle><unknown>undefined

    private static readonly __origin_console_ui = IsGame() ?
        (()=>{
            let h = BlzGetFrameByName("ConsoleUIBackdrop", 0)
            BlzFrameClearAllPoints(h)
            BlzFrameSetAbsPoint(h, FRAMEPOINT_BOTTOMLEFT, 0, 0.6)
            BlzFrameSetAbsPoint(h, FRAMEPOINT_BOTTOMRIGHT, 0, 0.6)
            BlzFrameSetAbsPoint(h, FRAMEPOINT_TOPLEFT, 0, 0.6)
            BlzFrameSetAbsPoint(h, FRAMEPOINT_TOPLEFT, 0, 0.6)
            return h
        })()
        : <jframehandle><unknown>undefined
}