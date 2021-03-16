import * as Fdf from "../Fdf";
import * as Handle from '../Handle'
import * as Utils from '../Utils'

const Log = Utils.Log

export abstract class FrameIFace extends Handle.Handle<jframehandle> {

    abstract x: number
    abstract y: number
    abstract pos: Utils.Vec2

    abstract width: number
    abstract height: number
    abstract size: Utils.Vec2

    abstract visible: boolean
    abstract enable: boolean
    abstract parent: FrameIFace | undefined
    abstract level: number
    abstract color: Utils.Color

    readonly abstract is_simple: boolean
    readonly abstract abs_pos: Utils.Vec2
    readonly abstract children: ReadonlyArray<FrameIFace>

}