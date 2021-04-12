import { Color, getFilePath, Log, Vec2, wcType } from "../Utils";
import { Handle } from "./Handle";

let __path__ = Macro(getFilePath())

function createFramehandle(name: string, is_simple: boolean){
    let handle: jframehandle|undefined
    let test: jframehandle|undefined

    handle = is_simple ? BlzCreateSimpleFrame(name, null, 0) : BlzCreateFrame(name, null, 0, 0)
    test = is_simple ? BlzCreateSimpleFrame('', null, 0) : BlzCreateFrame('', null, 0, 0)

    if (tostring(handle) == tostring(test)){
        BlzDestroyFrame(handle)
        BlzDestroyFrame(test)
        return Log.err('can not create framehandle with name ' + name,
                        __path__, hFrame, 2)
    }
    BlzDestroyFrame(test)
    return handle
}

export class hFrame extends Handle<jframehandle> {
    constructor(name: string, is_simple: boolean)
    constructor(name: jframehandle, is_simple: boolean)
    constructor(name: string|jframehandle, is_simple: boolean){
        super((():jframehandle => {
            if (typeof name === 'string'){
                return createFramehandle(name, is_simple)
            } else {
                return name
            }
        })())
    }

    static get(id: jframehandle | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'framehandle'){
            Log.err('got wrong type of handle.',
                    __path__, hFrame, 2)
        }
        return <hFrame>instance
    }

    get size(){return new Vec2(BlzFrameGetWidth(this.handle), BlzFrameGetHeight(this.handle))}
    set size(size: Vec2){
        BlzFrameSetSize(this.handle, size.x, size.y)
    }

    get parent(){
        let h = BlzFrameGetParent(this.handle)
        return h ? Handle.get(h) as hFrame : null
    }
    set parent(parent: hFrame | null){
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

    private __level = 0
    private __color = new Color(1, 1, 1, 1)
}