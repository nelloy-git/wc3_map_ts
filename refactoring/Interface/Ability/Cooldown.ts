import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt";
import { Action, Vec2 } from '../../Utils'

export class InterfaceAbilityCooldown extends Frame.SimpleImage {
    constructor(){
        super()

        this.__full_size = super._get_size()
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'

        this.__text = new Frame.SimpleText()
        this.__text.parent = this
        this.__text.pos = new Vec2(0, 0)
        this.__text.size = this.size
        this.__text.font = 'fonts\\nim_____.ttf'
        this.__text.fontSize = 0.35 * this.size.y
    }

    get ability(){return this.__abil}
    set ability(abil: Abil.Ability<any> | undefined){
        if (this.__abil){
            this.__abil.Data.Charges.removeAction(this.__changed_action)
            this.__abil.Data.Charges.removeAction(this.__cooldown_action)
        }

        this.__abil = abil
        this.visible = abil != undefined
        if (!abil){return}

        this.__changed_action = abil.Data.Charges.addAction('CHARGE_CHANGED',
                                                            charges => {this.__chargesChanged(charges)})

        this.__cooldown_action = abil.Data.Charges.addAction('CHARGE_CD',
                                                            charges => {this.__cooldownLoop(charges)})

        this.__chargesChanged(abil.Data.Charges)
        this.__cooldownLoop(abil.Data.Charges)
    }

    protected _get_size(){return this.__full_size}
    protected _set_size(size: Vec2){
        this.__full_size = size.copy()

        this.__text.size = size
        this.__text.fontSize = 0.35 * size.y
        
        if (this.__abil){
            this.__chargesChanged(this.__abil.Data.Charges)
            this.__cooldownLoop(this.__abil.Data.Charges)
        }
    }

    protected _set_visible(f: boolean){
        super._set_visible(f && (this.__abil != undefined))
    }

    private __chargesChanged(charges: Abil.Charges){
        let color = this.color
        color.a = charges.count < 1 ? 0.85 : 0.35
        this.color = color
        this.__text.visible = charges.count != charges.countMax
    }

    private __cooldownLoop(charges: Abil.Charges){
        let left = charges.left
        if (left <= 0){this.__text.text = ''; return}

        let full = charges.cooldown
        this.__cd_part = left / full

        let s = this.__full_size
        s.x = this.__cd_part * s.x
        super._set_size(s)
        this.__text.text = string.format('%.1f', left)
    }

    private __full_size: Vec2

    private __cd_part: number = 0
    private __abil: Abil.Ability<any> | undefined
    private __changed_action: Action<[Abil.Charges, Abil.Charges.Event], void> | undefined
    private __cooldown_action: Action<[Abil.Charges, Abil.Charges.Event], void> | undefined

    private __text: Frame.SimpleText
}