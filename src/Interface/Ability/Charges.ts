import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt";
import { Action } from '../../Utils'

export class InterfaceAbilityCharges extends Frame.Backdrop {
    constructor(){
        super()
        
        this.alpha = 0
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'

        this._text.parent = this
        this._text.alpha = 0
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
    set ability(abil: Abil.IFace | undefined){
        if (this._charges){
            this._charges.removeAction(this._charges_action)
        }

        this._abil = abil
        this._charges = abil ? abil.charges : undefined

        if (!this._charges){this.visible = false; return}

        this._charges_action = this._charges.addAction('COUNT_CHANGED',
                                                       (charges: Abil.Charges)=>
                                                           {this._chargesChanged(charges)})
        this._chargesChanged(this._charges)
    }

    private _chargesChanged(charges: Abil.Charges){
        let max = charges.countMax
        this.visible = max > 1
        print(this.visible)
        if (max > 1){
            let left = Math.floor(charges.count).toString()
            this._text.text = left
        }
    }

    private _abil: Abil.IFace | undefined;
    private _charges: Abil.Charges | undefined;
    private _charges_action: Action<[Abil.Charges, Abil.Charges.Event], void> | undefined;

    private _text = new Frame.SimpleText()
}