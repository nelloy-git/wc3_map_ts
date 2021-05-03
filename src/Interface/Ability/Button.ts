import { Abil, TTargeting } from "../../Abil";
import { GlueTextButton } from '../../FrameExt'
import { hMultiTimer, hMultiTimerSub } from '../../Handle'
import { Vec2 } from '../../Math'

import { InterfaceAbilityCharges } from "./Charges";
import { InterfaceAbilityCooldown } from "./Cooldown";
import { InterfaceHotkey } from '../Utils/Hotkey'

export class InterfaceAbilityButton extends GlueTextButton {
    constructor(){
        super()

        this.__charges = new InterfaceAbilityCharges()
        this.__charges.parent = this
        this.__charges.pos = new Vec2(0, 0.75 * this.size.y)
        this.__charges.level = this.level + 1

        this.__cooldown = new InterfaceAbilityCooldown()
        this.__cooldown.parent = this

        this.__hotkey = new InterfaceHotkey()
        this.__hotkey.parent = this
        this.__hotkey.actions.add('UP', (e, _, pl) => {this.__hotkeyUsed(e, pl)})
        this.__hotkey.actions.add('DOWN', (e, _, pl) => {this.__hotkeyUsed(e, pl)})

        this.size = this.size
        this.actions.add('CONTROL_CLICK', (frame, event, pl) => {this.__clicked(pl)})

        this.__timer = InterfaceAbilityButton.__multitimer.add()
        this.__timer.actions.add('LOOP', () => {this.__checkEnable()})
        this.__timer.actions.add('FINISH', (e, t) => {t.start(3600)})
        this.__timer.start(3600)
    }

    get ability(){return this.__abil}
    set ability(abil: Abil<any> | undefined){
        this.__clearAbility()
        this.__applyAbility(abil)
        this.__checkEnable()
    }

    get key(){return this.__hotkey.key}
    set key(key: joskeytype | undefined){
        this.__hotkey.key = key
    }

    destroy(){
        this.__timer.destroy()
        super.destroy()
    }

    protected _set_size(size: Vec2){
        super._set_size(size)
        
        this.__charges.pos = new Vec2(0.7 * size.x, -0.25 * size.y)
        this.__charges.size = new Vec2(0.3 * size.x, 0.25 * size.y)

        this.__hotkey.pos = new Vec2(0, -0.25 * size.y)
        this.__hotkey.size = new Vec2(0.3 * size.x, 0.25 * size.y)

        this.__cooldown.pos = new Vec2(0, 0)
        this.__cooldown.size = size
    }

    protected _set_visible(f: boolean){
        super._set_visible(f && (this.__abil != undefined))
    }

    private __clearAbility(){
        this.__abil = undefined
        this.visible = false
    }

    private __applyAbility(abil: Abil<any> | undefined){
        if (abil){
            let normal = this.getElement('NORMAL')
            if (normal){normal.texture = abil.Data.icon_normal}

            let pushed = this.getElement('PUSHED')
            if (pushed){pushed.texture = abil.Data.icon_normal}

            let disabled = this.getElement('DISABLED')
            if (disabled){disabled.texture = abil.Data.icon_disabled}
        }
        
        this.__abil = abil
        this.__charges.ability = abil
        this.__cooldown.ability = abil
        this.visible = abil != undefined
        this.__hotkey.visible = abil != undefined 
    }

    private __clicked(pl: jplayer){
        if (!this.__abil || !this.visible){
            return
        }

        let active = TTargeting.activeAbility(pl)
        if (active == undefined){
            this.__abil.Targeting.start(pl)
        } else if (active == this.__abil) {
            this.__abil.Targeting.finish(pl)
        } else {
            active.Targeting.cancel(pl)
            this.__abil.Targeting.start(pl)
        }
    }

    // Async func
    private __hotkeyUsed(e: InterfaceHotkey.Event, pl: jplayer){
        if (!this.__abil){
            return
        }

        let is_down = e == 'DOWN'
        let active = TTargeting.activeAbility(pl)
        if (this.smartCast){
            if (is_down && active == undefined){
                this.__abil.Targeting.start(pl)
            } else if (!is_down && this.__abil == active){
                this.__abil.Targeting.finish(pl)
            }
        } else {
            // TODO use on self 
        }
    }

    private __checkEnable(){
        if (!this.__abil){return}
        this.enable = this.__abil.Data.is_available
    }

    smartCast: boolean = true

    private __abil: Abil<any> | undefined
    private __charges: InterfaceAbilityCharges
    private __cooldown: InterfaceAbilityCooldown
    private __hotkey: InterfaceHotkey
    private __timer: hMultiTimerSub
    
    private static __multitimer = IsGame() ? new hMultiTimer(0.05)
                                           : <hMultiTimer><unknown>undefined
}