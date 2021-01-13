import * as Abil from "../../AbilityExt";
import { GlueTextButton } from '../../FrameExt'
import { Frame } from "../../FrameExt";
import { hTimerList } from "../../Handle";

import { InterfaceAbilityCharges } from "./Charges";
import { InterfaceAbilityCooldown } from "./Cooldown";
import { InterfaceHotkey } from '../Utils/Hotkey'
import { Mouse } from "../../Input";

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
    set ability(abil: Abil.Ability<any> | undefined){
        this._clearAbility()
        this._applyAbility(abil)
        this._checkEnable()
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

    private _applyAbility(abil: Abil.Ability<any> | undefined){
        if (abil){
            let normal = this.getElement('NORMAL')
            if (normal){normal.texture = abil.Data.icon_normal}

            let pushed = this.getElement('PUSHED')
            if (pushed){pushed.texture = abil.Data.icon_normal}

            let disabled = this.getElement('DISABLED')
            if (disabled){disabled.texture = abil.Data.icon_disabled}
        }
        
        this._abil = abil
        this._charges.ability = abil
        this._cooldown.ability = abil
        this.visible = abil != undefined
    }

    private _clicked(pl: jplayer){
        if (!this._abil){return}

        let active = Abil.TTargeting.activeAbility(pl)
        if (active == undefined){
            this._abil.Targeting.start(pl)
        } else if (active == this._abil) {
            this._abil.Targeting.finish(pl)
        } else {
            active.Targeting.cancel(pl)
            this._abil.Targeting.start(pl)
        }
    }

    // Async func
    private _hotkeyUsed(pl: jplayer, meta: number, is_down: boolean){
        if (!this._abil){return}

        let active = Abil.TTargeting.activeAbility(pl)
        if (this.smartCast){
            if (is_down && active == undefined){
                this._abil.Targeting.start(pl)
            } else if (!is_down && this._abil == active){
                this._abil.Targeting.finish(pl)
            }
        } else {
            // TODO use on self 
        }
    }

    private _checkEnable(){
        if (!this._abil){return}
        this.enable = this._abil.Data.is_available
    }

    private _abil: Abil.Ability<any> | undefined

    private _charges = new InterfaceAbilityCharges()
    private _cooldown = new InterfaceAbilityCooldown()
    private _hotkey = new InterfaceHotkey()
    private _timer = InterfaceAbilityButton._timer_list.newTimerObj()
    
    private static _timer_list: hTimerList = new hTimerList(0.05);
}