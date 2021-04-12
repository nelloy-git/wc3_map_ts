import { Vec2 } from '../Math'
import { Color } from "../Utils";
import { Handle } from "./Handle";

function createFramehandle(name: string, is_simple: boolean){
    let handle: jframehandle|undefined
    let test: jframehandle|undefined

    handle = is_simple ? BlzCreateSimpleFrame(name, null, 0) : BlzCreateFrame(name, null, 0, 0)
    test = is_simple ? BlzCreateSimpleFrame('', null, 0) : BlzCreateFrame('', null, 0, 0)

    if (tostring(handle) == tostring(test)){
        BlzDestroyFrame(handle)
        BlzDestroyFrame(test)
        throw('Can not create framehandle with name ' + name)
    }
    BlzDestroyFrame(test)
    return handle
}

export class hFrame extends Handle<jframehandle> {
    constructor(name: string, is_simple: boolean)
    constructor(handle: jframehandle, is_simple: boolean)
    constructor(name_or_handle: string|jframehandle, is_simple: boolean){
        let h
        if (typeof name_or_handle === 'string'){
            h = createFramehandle(name_or_handle, is_simple)
        } else {
            h = name_or_handle
        }

        super(h)
        this.__level = 0
        this.__color = new Color()
    }

    static get(id: jframehandle | number){
        return Handle.get(id, 'framehandle') as hFrame | undefined
    }

    get size(){
        return new Vec2(BlzFrameGetWidth(this.handle),
                        BlzFrameGetHeight(this.handle))
    }
    set size(size: Vec2){
        BlzFrameSetSize(this.handle, size.x, size.y)
    }

    get parent(){
        let h = BlzFrameGetParent(this.handle)
        return h ? hFrame.get(h) : undefined
    }
    set parent(parent: hFrame | undefined){
        BlzFrameSetParent(this.handle, parent ? parent.handle : undefined)
    }

    get visible(){return BlzFrameIsVisible(this.handle)};
    set visible(flag: boolean){
        BlzFrameSetVisible(this.handle, flag)
    }

    get enable(){return BlzFrameGetEnable(this.handle)}
    set enable(flag: boolean){
        BlzFrameSetEnable(this.handle, flag)
    }

    get level(){return this.__level}
    set level(lvl: number){
        this.__level = lvl
        BlzFrameSetLevel(this.handle, lvl)
    }

    get color(){return this.__color.copy()}
    set color(color: Color){
        this.__color = color.copy()
        BlzFrameSetVertexColor(this.handle, color.getWcCode())
    }

    setPoint(point: jframepointtype,
             other: hFrame, relative_point: jframepointtype,
             offset: Vec2){
        BlzFrameSetPoint(this.handle, point, other.handle, relative_point, offset.x, offset.y)
    }

    setPointAbs(point: jframepointtype, offset: Vec2){
        BlzFrameSetAbsPoint(this.handle, point, offset.x, offset.y)
    }

    setPointAll(other: hFrame){
        BlzFrameSetAllPoints(this.handle, other.handle)
    }

    freePointAll(){
        BlzFrameClearAllPoints(this.handle)
    }

    destroy(){
        BlzDestroyFrame(this.handle)
        super.destroy()
    }

    private __level: number
    private __color: Color
}