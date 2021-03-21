import * as Frame from "../../FrameExt"
import { Vec2 } from '../../Utils'

import { InterfaceBorderFdf } from "../Utils/BorderFdf"

export class InterfacePortrait extends Frame.Backdrop {
    static get inst(){
        if (!InterfacePortrait.__instance){
            InterfacePortrait.__instance = new InterfacePortrait()
        }

        return InterfacePortrait.__instance
    }

    protected _set_size(size: Vec2){
        super._set_size(size)
        this.__origin.pos = size.mult(0.075)
        this.__origin.size = size.mult(0.85)
    }

    private constructor(){
        super(InterfaceBorderFdf)

        this.__origin = Frame.OriginPortrait.inst()
        this.__origin.parent = this
    }

    private __origin: Frame.OriginPortrait

    private static __instance: InterfacePortrait
}