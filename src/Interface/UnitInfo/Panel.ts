import * as Frame from "../../FrameExt"
import { Vec2 } from '../../Math'

import { InterfaceBuffPanel } from "./Buff/Panel";
// import { InterfaceUnitBars } from "./Bars";
import { InterfaceUnitParameters } from "./Parameters";
import { InterfacePortrait } from "./Portrait";
import { IUnit } from "../Unit";

export class InterfaceUnitInfoPanel extends Frame.SimpleEmpty {
    static get inst(){
        if (!InterfaceUnitInfoPanel.__instance){
            InterfaceUnitInfoPanel.__instance = new InterfaceUnitInfoPanel()
        }

        return InterfaceUnitInfoPanel.__instance
    }

    get unit(){return this.__unit}
    set unit(u: IUnit | undefined){
        this.__unit = u
        this.visible = u != undefined

        // this.__bars.unit = u
        this.__buffs.buffs = u ? u.buffs : undefined
        // this.__params.unit = u
    }

    protected _set_size(size: Vec2){
        super._set_size(size)

        let p_s = this.__portrait_proportion * size.x

        this.__portrait.pos = new Vec2(0, 0)
        this.__portrait.size = new Vec2(p_s, p_s)

        // this.__bars.pos = new Vec2(p_s, 0)
        // this.__bars.size = new Vec2(size.x - p_s, p_s / 3)

        this.__buffs.pos = new Vec2(p_s, 1.05 * p_s / 3)
        this.__buffs.size = new Vec2(size.x - p_s, (size.x - p_s) / this.__buffs.cols * this.__buffs.rows)

        this.__params_btn.pos = new Vec2(p_s, p_s)
        this.__params_btn.size = new Vec2(p_s / 4, p_s / 4)

        this.__params.pos = new Vec2(0, p_s)
        this.__params.size = new Vec2(p_s, size.y - p_s)
    }

    protected _set_visible(f: boolean){
        super._set_visible(f && (this.__unit != undefined))
        this.__params.visible = f && this.__params_btn_pressed && (this.__unit != undefined)
    }

    private constructor(){
        super()

        // this.__bars = new InterfaceUnitBars()
        // this.__bars.parent = this

        this.__buffs = new InterfaceBuffPanel(8, 3)
        this.__buffs.parent = this

        this.__params = new InterfaceUnitParameters()
        this.__params.parent = this

        this.__portrait = InterfacePortrait.inst
        this.__portrait.parent = this

        this.__params_btn = new Frame.GlueTextButton()
        this.__params_btn.parent = this
        let normal = this.__params_btn.getElement('NORMAL')
        if (normal){normal.texture = 'ui\\widgets\\battlenet\\bnet-mainmenu-profile-up.dds'}
        let pushed = this.__params_btn.getElement('PUSHED')
        if (pushed){pushed.texture = 'ui\\widgets\\battlenet\\bnet-mainmenu-profile-down.dds'}
        this.__params_btn.actions.add('CONTROL_CLICK', (event, frame, pl)=>{
            if (pl != GetLocalPlayer()){return}

            this.__params_btn_pressed = !this.__params_btn_pressed
            this.__params.visible = this.visible && this.__params_btn_pressed && (this.__unit != undefined)
            if (normal){normal.texture = this.__params_btn_pressed ?
                                         'ui\\widgets\\battlenet\\bnet-mainmenu-profile-disabled.dds' :
                                         'ui\\widgets\\battlenet\\bnet-mainmenu-profile-up.dds'}
        })              

        this._update()
    }

    private __unit: IUnit | undefined

    // private __bars: InterfaceUnitBars
    private __buffs: InterfaceBuffPanel
    private __params: InterfaceUnitParameters
    private __params_btn: Frame.GlueTextButton
    private __params_btn_pressed = false
    private __portrait = InterfacePortrait.inst
    private __portrait_proportion = 0.35
    
    private static __instance: InterfaceUnitInfoPanel
}