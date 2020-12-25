import * as Abil from "../../AbilityExt";
import { GlueTextButton } from '../../FrameExt'
import { Frame } from "../../FrameExt";
import { Action } from "../../Utils";
import { hTimerList } from "../../Handle";

import { InterfaceAbilityCharges } from "./Charges";
import { InterfaceAbilityCooldown } from "./Cooldown";
import { InterfaceHotkey } from '../Utils/Hotkey'

export class InterfaceAbilityButton extends GlueTextButton {
    constructor(){
        super()

        this._charges.parent = this
        this._charges.visible = false
        this._charges.pos = [0, 0.75 * this.size[1]]
        this._charges.level = this.level + 1

        this._cooldown.parent = this
        this._cooldown.visible = false
        this._cooldown.pos = [0, 0]

        this._hotkey.parent = this
        this._hotkey.visible = true
        this._hotkey.pos = [0, 0]
        this._hotkey.size = [0.3 * this.size[0], 0.25 * this.size[1]]
        this._hotkey.action = (pl, meta, is_down)=>{this._hotkeyUsed(pl, meta, is_down)}

        this.size = this.size
        this.visible = false
        this.addAction('CLICK', (f: Frame, e:Frame.Event, pl:jplayer) => {this._clicked(pl)})

        this._timer.addAction('PERIOD', ()=>{this._checkEnable()})
        this._timer.addAction('FINISH', ()=>{this._timer.start(3600)})
        this._timer.start(3600)
    }

    protected _set_size(size: [number, number]){
        super._set_size(size)
        
        this._charges.size = [0.3 * size[0], 0.25 * size[1]]
        this._charges.pos = [0, 0.75 * size[1]]

        this._hotkey.size = [0.3 * size[0], 0.25 * size[1]]

        this._cooldown.size = size
    }

    get ability(){return this._abil}
    set ability(abil: Abil.IFace | undefined){
        this._clearAbility()
        this._applyAbility(abil)
    }

    get key(){return this._hotkey.key}
    set key(key: joskeytype | undefined){this._hotkey.key = key}

    smartCast: boolean = true

    destroy(){
        super.destroy()
        InterfaceAbilityButton._timer_list.removeTimerObj(this._timer)
    }

    private _clearAbility(){
        this._abil = undefined
        this.visible = false
    }

    private _applyAbility(abil: Abil.IFace | undefined){
        if (abil){
            let normal = this.getElement('NORMAL')
            if (normal){normal.texture = abil.type.data.iconNormal(abil)}

            let pushed = this.getElement('PUSHED')
            if (pushed){pushed.texture = abil.type.data.iconNormal(abil)}

            let disabled = this.getElement('DISABLED')
            if (disabled){disabled.texture = abil.type.data.iconDisabled(abil)}
        }
        
        this._abil = abil
        this._charges.ability = abil
        this._cooldown.ability = abil
        this.visible = abil != undefined
    }

    private _clicked(pl: jplayer){
        if (!this._abil ){return}

        let active = Abil.TypeTargeting.getActiveAbility(pl)
        if (this._abil == active){
            this._abil.targetingFinish(pl)
        } else {
            this._abil.targetingStart(pl)
        }
    }

    private _hotkeyUsed(pl: jplayer, meta: number, is_down: boolean){
        if (!this._abil){return}
        let active = Abil.TypeTargeting.getActiveAbility(pl)

        if (this.smartCast){
            if (is_down && this._abil != active){
                this._abil.targetingStart(pl)
                return
            } else if (!is_down && this._abil == active){
                this._abil.targetingFinish(pl)
                return
            }
        } else {
            // TODO
        }
    }

    private _checkEnable(){
        if (this._abil && this._abil.type.data.isAvailable(this._abil)){
            this.enable = true
        } else {
            this.enable = false
        }
    }

    private _abil: Abil.IFace | undefined

    private _charges = new InterfaceAbilityCharges()
    private _cooldown = new InterfaceAbilityCooldown()
    private _hotkey = new InterfaceHotkey()
    private _timer = InterfaceAbilityButton._timer_list.newTimerObj()
    
    private static _timer_list: hTimerList = new hTimerList(0.1);
}