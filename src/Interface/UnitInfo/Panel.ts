import * as Frame from "../../FrameExt"

import { InterfaceBuffPanel } from "./Buff/Panel";
import { InterfaceUnitBars } from "./Bars";
import { InterfaceUnitParameters } from "./Parameters";
import { InterfacePortrait } from "./Portrait";
import { hUnit } from "../../Handle";

export class InterfaceUnitInfoPanel extends Frame.SimpleEmpty {
    private constructor(){
        super()

        this._bars.parent = this
        this._bars.visible = false

        this._buffs.parent = this
        this._buffs.visible = false

        this._params.parent = this
        this._params.visible = false

        this._portrait.parent = this
        this._portrait.visible = false

        this.size = this.size
    }
    static get instance(){return InterfaceUnitInfoPanel._instance as InterfaceUnitInfoPanel}

    get unit(){return this._unit}
    set unit(u: hUnit | undefined){
        this._unit = u

        let is_visible = u != undefined

        this._bars.visible = is_visible
        this._buffs.visible = is_visible
        this._params.visible = is_visible
        this._portrait.visible = is_visible

        if (is_visible){
            this._bars.unit = u
            this._buffs.unit = u
            this._params.unit = u
        }
    }

    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)
        let [w, h] = size

        let p_s = this._portrait_proportion * w
        this._portrait.pos = [0, 0]
        this._portrait.size = [p_s, p_s]

        this._bars.pos = [p_s, 0]
        this._bars.size = [w - p_s, p_s / 3]

        this._buffs.pos = [p_s, 1.05 * p_s / 3]
        this._buffs.size = [(p_s / 2) / this._buffs.rows * this._buffs.cols, p_s / 2]

        this._params.pos = [0, p_s]
        this._params.size = [p_s, h - p_s]
    }

    private _unit: hUnit | undefined

    private _bars = new InterfaceUnitBars()
    private _buffs = new InterfaceBuffPanel(10, 3)
    private _params = new InterfaceUnitParameters()
    private _portrait = InterfacePortrait.instance
    private _portrait_proportion = 0.35
    
    private static _instance = IsGame() ? new InterfaceUnitInfoPanel() : undefined
}