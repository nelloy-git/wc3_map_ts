import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt";
import { Action } from '../../Utils'

export class InterfaceAbilityCharges extends Frame.Backdrop {
    constructor(){
        super()
        
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'

        this._text.parent = this
        this._text.pos = [0, 0]
        this._text.size = this.size
        this._text.font = 'fonts\\nim_____.ttf'
    }

    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)
        this._text.size = size
        this._text.fontSize = 0.8 * size[1]
    }

    get ability(){return this._abil}
    set ability(abil: Abil.Ability<any> | undefined){
        if (this._abil){
            this._abil.Data.Charges.removeAction(this._charged_action)
        }

        this._abil = abil
        if (!abil){return}

        this._charged_action = abil.Data.Charges.addAction('CHARGE_CHANGED',
                                                            charges => {this._chargesChanged(charges)})
        this._chargesChanged(abil.Data.Charges)
    }

    private _chargesChanged(charges: Abil.Charges){
        let max = charges.countMax
        this.visible = max > 1
        
        if (max > 1){
            let left = Math.floor(charges.count).toString()
            this._text.text = left
        }
    }

    private _abil: Abil.Ability<any> | undefined;
    private _charged_action: Action<[Abil.Charges, Abil.Charges.Event], void> | undefined;

    private _text = new Frame.SimpleText()
}