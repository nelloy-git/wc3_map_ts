import * as Frame from "../FrameExt"
import { InterfaceBorderFdf } from "./Utils/BorderFdf"

export class InterfaceMinimap extends Frame.Backdrop {
    private constructor(){
        super(InterfaceBorderFdf)
    }
    static get instance(){return InterfaceMinimap._instance as InterfaceMinimap}

    protected _set_pos(pos: [x: number, y: number]){
        super._set_pos(pos)
        let orig = Frame.OriginMinimap.instance()
        if (orig){
            if (orig.parent != this){orig.parent = this}
            orig.pos = [0.05 * this.size[0], 0.05 * this.size[1]]
        }
    }

    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)
        let orig = Frame.OriginMinimap.instance()
        if (orig){
            if (orig.parent != this){orig.parent = this}
            orig.size = [0.9 * this.size[0], 0.9 * this.size[1]]
        }
    }

    private static _instance = IsGame() ? new InterfaceMinimap() : undefined
}