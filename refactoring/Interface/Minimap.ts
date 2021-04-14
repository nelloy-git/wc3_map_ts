import * as Frame from "../FrameExt"
import { Vec2 } from '../../src/Utils'

import { InterfaceBorderFdf } from './Utils/BorderFdf'

const ORIG_WIDTH = 0.9
const ORIG_HEIGHT = 0.9

export class InterfaceMinimap extends Frame.Backdrop {
    static get inst(){
        if (!InterfaceMinimap.__instance){
            InterfaceMinimap.__instance = new InterfaceMinimap()
        }

        return InterfaceMinimap.__instance
    }

    protected _set_size(size: Vec2){
        size.x = size.x > Frame.OriginMinimap.MIN_SIZE / ORIG_WIDTH ?
            size.x
            : Frame.OriginMinimap.MIN_SIZE / ORIG_WIDTH
        size.y = size.y > Frame.OriginMinimap.MIN_SIZE / ORIG_HEIGHT ?
            size.y
            : Frame.OriginMinimap.MIN_SIZE / ORIG_HEIGHT

        super._set_size(size)
        this.__origin.size = new Vec2(ORIG_WIDTH * size.x, ORIG_HEIGHT * size.y)
        this.__origin.pos = new Vec2((1 - ORIG_WIDTH) / 2 * size.x,
                                     (1 - ORIG_HEIGHT) / 2 * size.y)
    }

    private constructor(){
        super(InterfaceBorderFdf)

        this.__origin = Frame.OriginMinimap.inst()
        this.__origin.parent = this
    }

    private __origin: Frame.OriginMinimap

    private static __instance: InterfaceMinimap
}