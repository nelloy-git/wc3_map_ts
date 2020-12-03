import { Color, Log, wcType } from "../Utils";
import { Handle } from "./Handle";

function createFramehandle(name: string, is_simple: boolean){
    let handle: jframehandle|undefined
    let test: jframehandle|undefined

    handle = is_simple ? BlzCreateSimpleFrame(name, null, 0) : BlzCreateFrame(name, null, 0, 0)
    test = is_simple ? BlzCreateSimpleFrame('', null, 0) : BlzCreateFrame('', null, 0, 0)

    if (tostring(handle) == tostring(test)){
        BlzDestroyFrame(handle)
        BlzDestroyFrame(test)
        return Log.err(Frame.toString() +
                       ': can not create framehandle with name ' + name)
    }
    BlzDestroyFrame(test)
    return handle
}

export class Frame extends Handle<jframehandle> {
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
    public static get(id: jframehandle | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'framehandle'){
            Log.err('Frame: got wrong type of handle.', 2)
        }
        return <Frame>instance
    }

    public get size():[w: number, h: number]{return [BlzFrameGetWidth(this.handle), BlzFrameGetHeight(this.handle)]}
    public set size(size: [w: number, h: number]){BlzFrameSetSize(this.handle, size[0], size[1])}

    public get parent(){let h = BlzFrameGetParent(this.handle); return h ? Handle.get(h) as Frame : null}
    public set parent(parent: Frame | null){BlzFrameSetParent(this.handle, parent?.handle)}

    public get visible(){return BlzFrameIsVisible(this.handle)};
    public set visible(flag: boolean){BlzFrameSetVisible(this.handle, flag)};

    public get enable(){return BlzFrameGetEnable(this.handle)}
    public set enable(flag: boolean){BlzFrameSetEnable(this.handle, flag)}

    public get level(){return this._level}
    public set level(lvl: number){this._level = lvl; BlzFrameSetLevel(this.handle, lvl)}

    public get color(){return new Color(this._color)}
    public set color(color: Color){
        this._color = new Color(color)
        BlzFrameSetVertexColor(this.handle, color.getWcCode())
    }

    public setPoint(relative: Frame, 
                    point: jframepointtype, relative_point: jframepointtype,
                    x: number, y: number){
        BlzFrameSetPoint(this.handle, point, relative.handle, relative_point, x, y)
    }
    public setPointAbs(point: jframepointtype, x: number, y:number){
        BlzFrameSetAbsPoint(this.handle, point, x, y)
    }
    public setPointAll(relative: Frame){BlzFrameSetAllPoints(this.handle, relative.handle)}
    public freePointAll(){BlzFrameClearAllPoints(this.handle)}

    destroy(){
        BlzDestroyFrame(this.handle)
        super.destroy()
    }

    private _level = 0
    private _color = new Color(1, 1, 1, 1)
}