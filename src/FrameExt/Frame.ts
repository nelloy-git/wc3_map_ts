import { Vec2 } from '../Math'
import { Color } from '../Utils'
import { Fdf } from '../Fdf'

import { FrameIFace } from './FrameIFace'

export abstract class Frame extends FrameIFace  {

    constructor(fdf: Fdf, is_simple: boolean)
    constructor(handle: jframehandle, is_simple: boolean)
    constructor(handle_or_fdf: jframehandle | Fdf, is_simple: boolean)
    constructor(handle_or_fdf: jframehandle | Fdf, is_simple: boolean){
        let handle: jframehandle | undefined
        
        if (handle_or_fdf instanceof Fdf){
            let fdf = handle_or_fdf;
            [handle, is_simple] = Frame._fromFdf(fdf)
        } else {
            handle = handle_or_fdf
        }

        super(<jframehandle>handle, is_simple)

        this.__pos = new Vec2(0, 0)
        this.__size = new Vec2(0, 0)
        this.__visible = true
        this.__enable = true
        this.__parent = undefined
        this.__level = 0
        this.__color = new Color()
        this.__children = []
    }

    get parent(){return this._get_parent()}
    set parent(p: Frame | undefined){this._set_parent(p)}
    get children(){return this._get_children() as ReadonlyArray<Frame>}

    protected _get_pos(){return this.__pos.copy()}
    protected _set_pos(v: Vec2){
        this.__pos = v.copy()
        if (this.__parent){
            BlzFrameSetPoint(this.handle, FRAMEPOINT_TOPLEFT,
                             this.__parent.handle, FRAMEPOINT_TOPLEFT,
                             v.x, -v.y)
        } else {
            BlzFrameSetAbsPoint(this.handle, FRAMEPOINT_TOPLEFT,
                                v.x, 0.6 - v.y)
        }

        // Update children positions.
        for (let child of this.__children){
            child.pos = child.pos
        }
    }

    protected _get_size(){return this.__size}
    protected _set_size(v: Vec2){
        this.__size = v.copy()
        BlzFrameSetSize(this.handle, v.x, v.y)
    }

    protected _get_visible(){
        return BlzFrameIsVisible(this.handle)
    }
    protected _set_visible(f: boolean){
        this.__visible = f

        let par_visible = true
        if (this.parent){
            par_visible = this.parent.visible
        }
        
        let is_visible = f && par_visible
        BlzFrameSetVisible(this.handle, is_visible)

        // Update children visibility.
        for (let child of this.__children){
            child.visible = child.__visible
        }
    }

    protected _get_enable(){return this.__enable}
    protected _set_enable(f: boolean){
        this.__enable = f

        let par_enable = this.parent ? this.parent.enable : true
        BlzFrameSetEnable(this.handle, f && par_enable)
        
        // Update children visibility.
        for (let child of this.__children){
            child.enable = child.enable
        }
    }

    protected _get_parent(): Frame | undefined {return this.__parent}
    protected _set_parent(p: Frame | undefined){
        if (this.__parent){
            this.__parent.__children.splice(this.__parent.__children.indexOf(this))
        }

        this.__parent = p
        if (p){
            p.__children.push(this)
        }
    }
    protected _get_children(){return this.__children}
    
    protected _get_level(){return this.__level}
    protected _set_level(lvl: number){
        this.__level = lvl
        BlzFrameSetLevel(this.handle, lvl)
    }

    protected _get_color(){return this.__color.copy()}
    protected _set_color(c: Color){
        this.__color = c.copy()
        BlzFrameSetVertexColor(this.handle, c.getWcCode())
        BlzFrameSetAlpha(this.handle, c.a)
    }

    protected _update(){
        let root = this.__parent ? this.__parent : this
        root.pos = root.pos
        root.size = root.size
        root.visible = root.visible
    }

    private __pos: Vec2
    private __size: Vec2
    private __visible: boolean
    private __enable: boolean
    private __parent: Frame | undefined
    private __level: number
    private __color: Color
    private __children: Frame[]
}