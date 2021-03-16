import * as Handle from '../Handle'
import * as Utils from '../Utils'

const Log = Utils.Log

import { Frame } from './Frame'

let __path__ = Macro(Utils.getFilePath())

export class FrameActive extends Frame  {
    static get(id: jframehandle | number){
        let instance = Handle.Handle.get(id)
        if (instance instanceof FrameActive){
            return instance
        }
        return undefined
    }
    static getTriggered(){return FrameActive.get(BlzGetTriggerFrame())}

    constructor(handle: jframehandle, is_simple: boolean){
        super(handle, is_simple)

        this.is_simple = is_simple

        this.__pos = new Utils.Vec2(0, 0)
        this.__size = new Utils.Vec2(0, 0)
        this.__visible = true
        this.__enable = true
        this.__parent = undefined
        this.__children = []
        this.__level = 0
        this.__color = new Utils.Color(1, 1, 1, 1)
    }
    
    readonly is_simple: boolean

    destroy(){ 
        this.__removeFromParent()
        this.__removeFromChildren()

        BlzDestroyFrame(this.handle)
        super.destroy()
    }

    get x(){return this.__pos.x}
    set x(x: number){this.pos = new Utils.Vec2(x, this.__pos.y)}

    get y(){return this.__pos.y}
    set y(y: number){this.pos = new Utils.Vec2(this.__pos.x, y)}

    get pos(){return this.__pos.copy()}
    set pos(v: Utils.Vec2){
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

    get abs_pos(): Utils.Vec2{
        return this.__parent ? this.__parent.abs_pos.add(this.__pos): this.__pos.copy()
    }

    get width(){return this.__size.x}
    set width(w: number){this.size = new Utils.Vec2(w, this.__size.y)}
    
    get height(){return this.__size.y}
    set height(h: number){this.size = new Utils.Vec2(this.__size.x, h)}

    get size(){return this.__size}
    set size(v: Utils.Vec2){
        this.__size = v.copy()
        BlzFrameSetSize(this.handle, v.x, v.y)
    }

    get visible(){return this.__visible}
    set visible(f: boolean){
        this.__visible = f
        BlzFrameSetVisible(this.handle, f)

        // Update children visibility.
        for (let child of this.__children){
            child.visible = child.visible
        }
    }

    get enable(){return this.__enable}
    set enable(f: boolean){
        this.__enable = f
        BlzFrameSetVisible(this.handle, f)
        
        // Update children visibility.
        for (let child of this.__children){
            child.enable = child.enable
        }
    }

    get parent(){return this.__parent}
    set parent(p: Frame | undefined){
        this.__removeFromParent()

        this.__parent = p
        if (p){
            p.__children.push(this)
            
            p.pos = p.pos
            p.visible = p.visible
            p.enable = p.enable
        } else {
            this.pos = this.pos
            this.visible = this.visible
            this.enable = this.enable
        }
    }
    get children(){return this.__children as ReadonlyArray<Frame>}
    
    get level(){return this.__level}
    set level(lvl: number){
        this.__level = lvl
        BlzFrameSetLevel(this.handle, lvl)
    }

    get color(){return this.__color.copy()}
    set color(c: Utils.Color){
        this.__color = c.copy()
        BlzFrameSetVertexColor(this.handle, c.getWcCode())
        BlzFrameSetAlpha(this.handle, Math.floor(255 * c.a))
    }

    __removeFromParent(){
        if (this.__parent){
            let p_children = this.__parent.__children
            p_children.splice(p_children.indexOf(this), 1)
        }
    }

    __removeFromChildren(){
        for (let child of this.__children){
            child.parent = undefined
        }
    }

    private __pos: Utils.Vec2
    private __size: Utils.Vec2
    private __visible: boolean
    private __enable: boolean
    private __parent: Frame | undefined
    private __children: Frame[]
    private __level: number
    private __color: Utils.Color
}