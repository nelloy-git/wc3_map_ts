import * as Fdf from '../Fdf'
import * as Handle from '../Handle'
import * as Utils from '../Utils'

import { FrameIFace } from './FrameIFace'

export abstract class Frame extends FrameIFace  {

    constructor(handle: jframehandle, is_simple: boolean){
        super(handle, is_simple)

        this.__pos = new Utils.Vec2(0, 0)
        this.__size = new Utils.Vec2(0, 0)
        this.__visible = true
        this.__enable = true
        this.__parent = undefined
        this.__level = 0
        this.__color = new Utils.Color(1, 1, 1, 1)
    }

    protected _get_pos(){return this.__pos.copy()}
    protected _set_pos(v: Utils.Vec2){
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
        for (let child of this._children){
            child.pos = child.pos
        }
    }

    protected _get_size(){return this.__size}
    protected _set_size(v: Utils.Vec2){
        this.__size = v.copy()
        BlzFrameSetSize(this.handle, v.x, v.y)
    }

    protected _get_visible(){return this.__visible}
    protected _set_visible(f: boolean){
        this.__visible = f
        BlzFrameSetVisible(this.handle, f)

        // Update children visibility.
        for (let child of this._children){
            child.visible = child.visible
        }
    }

    protected _get_enable(){return this.__enable}
    protected _set_enable(f: boolean){
        this.__enable = f
        BlzFrameSetVisible(this.handle, f)
        
        // Update children visibility.
        for (let child of this._children){
            child.enable = child.enable
        }
    }

    protected _get_parent(){return this.__parent}
    protected _set_parent(p: FrameIFace | undefined){
        if (this.__parent){
            this.__parent._children.splice(this.__parent._children.indexOf(this))
        }

        this.__parent = p
        if (p){
            p._children.push(this)
            
            p.pos = p.pos
            p.visible = p.visible
            p.enable = p.enable
        } else {
            this.pos = this.pos
            this.visible = this.visible
            this.enable = this.enable
        }
    }
    
    protected _get_level(){return this.__level}
    protected _set_level(lvl: number){
        this.__level = lvl
        BlzFrameSetLevel(this.handle, lvl)
    }

    protected _get_color(){return this.__color.copy()}
    protected _set_color(c: Utils.Color){
        this.__color = c.copy()
        BlzFrameSetVertexColor(this.handle, c.getWcCode())
        BlzFrameSetAlpha(this.handle, Math.floor(255 * c.a))
    }

    private __pos: Utils.Vec2
    private __size: Utils.Vec2
    private __visible: boolean
    private __enable: boolean
    private __parent: FrameIFace | undefined
    private __level: number
    private __color: Utils.Color
}