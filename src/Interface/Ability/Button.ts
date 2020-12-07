import { AbilityIFace, AbilityTypeTargeting } from "../../AbilityExt";
import { Charges } from "../../AbilityExt/Charges";
import { GlueTextButton } from '../../FrameExt'
import { Frame } from "../../FrameExt";
import { Action } from "../../Utils";
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
    }

    get size(){return this._get_size()}
    set size(size: [number, number]){
        this._set_size(size)

        this._charges.size = [0.3 * size[0], 0.25 * size[1]]
        this._charges.pos = [0, 0.75 * size[1]]

        this._hotkey.size = [0.3 * size[0], 0.25 * size[1]]

        this._cooldown.size = size
    }

    get ability(){return this._abil}
    set ability(abil: AbilityIFace | undefined){
        this._clearAbility()
        this._applyAbility(abil)
    }

    get key(){return this._hotkey.key}
    set key(key: joskeytype | undefined){this._hotkey.key = key}

    smartCast: boolean = true

    private _clearAbility(){
        if (!this._abil){return}

        this._abil.charges.removeAction(this._charges_changed_action)

        this._abil = undefined
        this.visible = false
    }

    private _applyAbility(abil: AbilityIFace | undefined){
        this._abil = abil
        this._charges.ability = abil
        this._cooldown.ability = abil
        this.visible = abil != undefined

        if (!abil){return}

        let normal = this.getElement('NORMAL')
        if (normal){normal.texture = abil.type.data.iconNormal(abil)}

        let pushed = this.getElement('PUSHED')
        if (pushed){pushed.texture = abil.type.data.iconNormal(abil)}

        let disabled = this.getElement('DISABLED')
        if (disabled){disabled.texture = abil.type.data.iconDisabled(abil)}

        this._charges_changed_action = abil.charges.addAction('COUNT_CHANGED', (charges) => {
            this.enable = charges.count > 0
        })
    }

    private _clicked(pl: jplayer){
        if (!this._abil){return}

        let active = AbilityTypeTargeting.getActiveAbility(pl)
        if (this._abil == active){
            this._abil.targetingFinish(pl)
        } else {
            this._abil.targetingStart(pl)
        }
    }

    private _hotkeyUsed(pl: jplayer, meta: number, is_down: boolean){
        if (!this._abil){return}
        let active = AbilityTypeTargeting.getActiveAbility(pl)

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

    private _abil: AbilityIFace | undefined

    private _charges = new InterfaceAbilityCharges()
    private _cooldown = new InterfaceAbilityCooldown()
    private _hotkey = new InterfaceHotkey()
    private _charges_changed_action: Action<[Charges, Charges.Event], void> | undefined;
}