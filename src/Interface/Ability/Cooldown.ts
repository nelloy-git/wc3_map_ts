import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt";
import { Action } from '../../Utils'
import { float2str } from '../../Utils';

export class InterfaceAbilityCooldown extends Frame.SimpleImage {
    constructor(){
        super()

        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'

        this._text.parent = this
        this._text.pos = [0, 0]
        this._text.size = this.size
        this._text.font = 'fonts\\nim_____.ttf'
        this._text.fontSize = 0.35 * this.size[1]
    }

    protected _set_size(size: [number, number]){
        this._size = size
        super._set_size([this._cd_part * size[0], size[1]])

        this._text.size = size
        this._text.fontSize = 0.35 * size[1]
    }

    get ability(){return this._abil}
    set ability(abil: Abil.IFace | undefined){
        if (this._charges){
            this._charges?.removeAction(this._changed_action)
            this._charges?.removeAction(this._cooldown_action)
        }

        this._abil = abil
        this._charges = abil ? abil.charges : undefined
        if (!this._charges){this.visible = false; return}

        this.visible = true
        this._changed_action = this._charges.addAction('COUNT_CHANGED',
                                                        (charges: Abil.Charges): void => 
                                                            {this._chargesChanged(charges)})
        this._chargesChanged(this._charges)

        this._cooldown_action = this._charges.addAction('COOLDOWN_LOOP',
                                                        (charges: Abil.Charges): void =>
                                                            {this._cooldownLoop(charges)})
        this._cooldownLoop(this._charges)
    }

    private _chargesChanged(charges: Abil.Charges){
        let color = this.color
        color.a = charges.count < 1 ? 0.85 : 0.35
        this.color = color
        this._text.visible = charges.count != charges.countMax
    }

    private _cooldownLoop(charges: Abil.Charges){
        let left = charges.timeLeft
        if (left <= 0){this._text.text = ''; return}

        let full = charges.cooldown
        this._cd_part = left / full

        super._set_size([this._cd_part * this._size[0], this._size[1]])
        this._text.text = float2str(left, 1)
    }

    private _size: [number, number] = this._get_size();

    private _cd_part: number = 0;
    private _abil: Abil.IFace | undefined;
    private _charges: Abil.Charges | undefined;
    private _changed_action: Action<[Abil.Charges, Abil.Charges.Event], void> | undefined;
    private _cooldown_action: Action<[Abil.Charges, Abil.Charges.Event], void> | undefined

    private _text = new Frame.SimpleText()
}