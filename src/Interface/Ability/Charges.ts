import { Action } from '../../Utils'
import { AbilityIFace, AbilityCharges} from "../../AbilityExt";
import { Backdrop, SimpleText } from "../../FrameExt";

export class InterfaceAbilityCharges extends Backdrop {
    constructor(){
        super()
        
        this.visible = false
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'

        this._text.parent = this
        this._text.pos = [0, 0]
        this._text.size = this.size
        this._text.font = 'fonts\\nim_____.ttf'
    }

    get size(){return this._get_size()}
    set size(size: [w: number, h: number]){
        this._set_size(size)
        this._text.size = size
        this._text.fontSize = 0.8 * size[1]
    }

    get ability(){return this._abil}
    set ability(abil: AbilityIFace | undefined){
        if (this._charges){
            this._charges.removeAction(this._charges_action)
        }

        this._abil = abil
        this._charges = abil ? abil.charges : undefined

        if (!this._charges){this.visible = false; return}

        this._charges_action = this._charges.addAction('COUNT_CHANGED',
                                                       (charges: AbilityCharges)=>
                                                           {this._chargesChanged(charges)})
        this._chargesChanged(this._charges)
    }

    private _chargesChanged(charges: AbilityCharges){
        let max = charges.countMax
        this.visible = max > 1
        if (max > 1){
            let left = Math.floor(charges.count).toString()
            this._text.text = left
        }
    }

    private _abil: AbilityIFace | undefined;
    private _charges: AbilityCharges | undefined;
    private _charges_action: Action<[AbilityCharges, AbilityCharges.Event], void> | undefined;

    private _text = new SimpleText()
}