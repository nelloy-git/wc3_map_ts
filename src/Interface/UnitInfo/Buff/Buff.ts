import { Buff } from "../../../Buff";
import { GlueTextButton } from "../../../FrameExt";

export class InterfaceBuff extends GlueTextButton {
    constructor(){
        super()
        this.visible = false
    }

    get buff(){return this.__buff}
    set buff(buff: Buff<any> | undefined){
        if (this.__buff == buff){
            return
        }

        this.__buff = buff
        this.visible = buff != undefined
        if (buff){
            let normal = this.getElement('NORMAL')
            if (normal){normal.texture = buff.type.TData.icon(buff)}
            let pushed = this.getElement('PUSHED')
            if (pushed){pushed.texture = buff.type.TData.icon(buff)}
        }
    }

    private __buff: Buff<any> | undefined
}