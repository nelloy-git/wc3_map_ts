import * as Buff from "../../../Buff";
import { GlueTextButton } from "../../../FrameExt";

export class InterfaceBuff extends GlueTextButton {
    constructor(){
        super()
        this.visible = false
    }

    get buff(){return this.__buff}
    set buff(buff: Buff.IFace<any> | undefined){
        this.visible = buff != undefined
        if (buff){
            let normal = this.getElement('NORMAL')
            if (normal){normal.texture = buff.Data.icon}
        }
    }

    private __buff: Buff.IFace<any> | undefined
}