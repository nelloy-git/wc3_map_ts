import { BuffIFace } from "../../Buff";
import { GlueTextButton } from "../../FrameExt";

export class InterfaceBuff extends GlueTextButton {
    constructor(){
        super()
        this.visible = false
    }

    get buff(){return this._buff}
    set buff(buff: BuffIFace | undefined){
        this.visible = buff != undefined
        if (buff){
            let normal = this.getElement('NORMAL')
            if (normal){normal.texture = buff.type.data.icon(buff)}
        }
    }

    private _buff: BuffIFace | undefined
}