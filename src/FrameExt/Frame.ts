import { Handle } from "../Handle";
import { Log, wcType } from "../Utils";
import { Fdf } from "./Fdf";

function createFramehandle(handle: jframehandle | Fdf, is_simple?: boolean){
    let name
    if (handle instanceof Fdf){
        name = handle.name
        is_simple = handle.is_simple
    } else {
        return handle
    }

    handle = is_simple ? BlzCreateSimpleFrame(name, null, 0) : BlzCreateFrame(name, null, 0, 0)
    let test_h = is_simple ? BlzCreateSimpleFrame('', null, 0) : BlzCreateFrame('', null, 0, 0)

    if (tostring(handle) == tostring(test_h)){
        BlzDestroyFrame(handle)
        BlzDestroyFrame(test_h)
        return Log.err(Frame.toString() +
                       ': can not create framehandle with name ' + name)
    }
    BlzDestroyFrame(test_h)
    return handle
}

export class Frame extends Handle<jframehandle> {
    constructor(fdf: Fdf)
    constructor(handle: jframehandle, is_simple: boolean)
    constructor(handle: jframehandle | Fdf, is_simple?: boolean){
        super(createFramehandle(handle, is_simple))
        this.isSimple = (typeof is_simple === 'boolean') ? is_simple : (handle as Fdf).is_simple
    }
    
    public static get(id: jframehandle | number){
        let instance = Handle.get(id)
        if (!instance){return}
        if (wcType(instance.handle) != 'framehandle'){
            Log.err('Frame: got wrong type of handle.', 2)
        }
        return <Frame>instance
    }

    public get pos(){return [this._x, this._y]}
    public set pos(pos: [x: number, y: number]){
        [this._x, this._y] = pos
        if (this._parent){
            BlzFrameSetPoint(this.handle, FRAMEPOINT_TOPLEFT,
                             this._parent.handle, FRAMEPOINT_TOPLEFT,
                             this._x, this._y)
        } else {
            BlzFrameSetAbsPoint(this.handle, FRAMEPOINT_TOPLEFT,
                                this._x, 0.6 - this._y)
        }

        for (let i = 0; i < this._children.length; i++){
            this._children[0].pos = this._children[0].pos
        }
    }

    public get absPos(): [number, number]{
        let [parent_absX, parent_absY] = this._parent ? this._parent.absPos : [0, 0]
        return [parent_absX + this._x, parent_absY + this._y]
    }

    public get size():[w: number, h: number]{return [BlzFrameGetWidth(this.handle), BlzFrameGetHeight(this.handle)]}
    public set size(size: [w: number, h: number]){BlzFrameSetSize(this.handle, size[0], size[1])}

    

    protected _destroy(){
        BlzDestroyFrame(this.handle)
    }

    readonly isSimple: boolean;
    private _x: number = 0;
    private _y: number = 0;
    private _parent: Frame | undefined;
    private _children: Frame[] = [];
}