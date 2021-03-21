import * as Abil from "../../AbilityExt";
import * as Frame from '../../FrameExt'
import * as Handle from '../../Handle'
import { Vec2 } from '../../Utils'

import { InterfaceAbilityCharges } from "./Charges";
import { InterfaceAbilityCooldown } from "./Cooldown";
import { InterfaceHotkey } from '../Utils/Hotkey'

export class InterfaceAbilityButton extends Frame.GlueTextButton {
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
        this.__hotkey.action = (pl, meta, is_down)=>{this.__hotkeyUsed(pl, meta, is_down)}

        this.size = this.size
        this.addAction(FRAMEEVENT_CONTROL_CLICK, 
                       (f: Frame.FrameActive, e: jframeeventtype, pl:jplayer) =>
                            {this.__clicked(pl)})

        this.__timer = InterfaceAbilityButton.__timer_list.newTimerObj()
        this.__timer.addAction('PERIOD', ()=>{this._checkEnable()})
        this.__timer.addAction('FINISH', (tm)=>{tm.start(3600)})
        this.__timer.start(3600)
    }

    get ability(){return this.__abil}
    set ability(abil: Abil.Ability<any> | undefined){
        this.__clearAbility()
        this.__applyAbility(abil)
        this._checkEnable()
    }

    get key(){return this.__hotkey.key}
    set key(key: joskeytype | undefined){
        this.__hotkey.key = key
    }

    destroy(){
        super.destroy()
        InterfaceAbilityButton.__timer_list.removeTimerObj(this.__timer)
    }

    protected _set_size(size: Vec2){
        super._set_size(size)
        
        this.__charges.pos = new Vec2(0, 0.75 * size.y)
        this.__charges.size = new Vec2(0.3 * size.x, 0.25 * size.y)

        this.__hotkey.pos = new Vec2(0, 0)
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

    private __applyAbility(abil: Abil.Ability<any> | undefined){
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
        if (!this.__abil || !this.visible){return}

        let active = Abil.TTargeting.activeAbility(pl)
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
    private __hotkeyUsed(pl: jplayer, meta: number, is_down: boolean){
        if (!this.__abil){return}

        let active = Abil.TTargeting.activeAbility(pl)
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

    private _checkEnable(){
        if (!this.__abil){return}
        this.enable = this.__abil.Data.is_available
    }

    smartCast: boolean = true

    private __abil: Abil.Ability<any> | undefined
    private __charges: InterfaceAbilityCharges
    private __cooldown: InterfaceAbilityCooldown
    private __hotkey: InterfaceHotkey
    private __timer: Handle.hTimerObj
    
    private static __timer_list = new Handle.hTimerList(0.05);
}