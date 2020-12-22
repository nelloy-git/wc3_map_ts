import * as Frame from "../../FrameExt"

import { InterfaceBorderFdf } from "../Utils/BorderFdf"

export class InterfacePortrait extends Frame.Backdrop {
    private constructor(){
        super(InterfaceBorderFdf)
    }
    static get instance(){return InterfacePortrait._instance as InterfacePortrait}

    protected _set_pos(pos: [x: number, y: number]){
        super._set_pos(pos)
        let [x, y] = this.absPos
        let [w, h] = this.size

        let orig = Frame.OriginPortrait.instance()
        if (orig){
            orig.pos = [x + 0.05 * w, y + 0.05 * h]
        }
    }

    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)
        let [x, y] = this.absPos
        let [w, h] = size

        let orig = Frame.OriginPortrait.instance()
        if (orig){
            orig.pos = [x + 0.05 * w, y + 0.05 * h]
            orig.size = [0.9 * w, 0.9 * h]
        }
    }

    protected _set_visible(flag: boolean){
        super._set_visible(flag)
        let orig = Frame.OriginPortrait.instance()
        if (orig){
            orig.visible = flag
        }
    }

    private static _instance = IsGame() ? new InterfacePortrait() : undefined
}