import { Action } from '../../Utils'
import { AbilityIFace, AbilityCharges} from "../../AbilityExt";
import { SimpleImage, SimpleText } from "../../FrameExt";
import { float2str } from '../../Utils';

export class InterfaceAbilityCooldown extends SimpleImage {
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
        super._set_size([size[0], this._cd_part * size[1]])

        this._text.size = size
        this._text.fontSize = 0.35 * size[1]
    }

    get ability(){return this._abil}
    set ability(abil: AbilityIFace | undefined){
        if (this._charges){
            this._charges?.removeAction(this._changed_action)
            this._charges?.removeAction(this._cooldown_action)
        }

        this._abil = abil
        this._charges = abil ? abil.charges : undefined
        if (!this._charges){this.visible = false; return}

        this.visible = true
        this._changed_action = this._charges.addAction('COUNT_CHANGED',
                                                        (charges: AbilityCharges): void => 
                                                            {this._chargesChanged(charges)})
        this._cooldown_action = this._charges.addAction('COOLDOWN_LOOP',
                                                        (charges: AbilityCharges): void =>
                                                            {this._cooldownLoop(charges)})
    }

    private _chargesChanged(charges: AbilityCharges){
        let alpha = charges.count < 1 ? 0.85 : 0.35
        this.alpha = alpha
        this._text.visible = !(charges.count == charges.countMax)
    }

    private _cooldownLoop(charges: AbilityCharges){
        let left = charges.timeLeft
        let full = charges.cooldown
        this._cd_part = left / full

        this._set_size([this._cd_part * this._size[0], this._size[1]])
        this._text.text = float2str(left, 1)
    }

    private _size: [number, number] = this._get_size();

    private _cd_part: number = 0;
    private _abil: AbilityIFace | undefined;
    private _charges: AbilityCharges | undefined;
    private _changed_action: Action<[AbilityCharges, AbilityCharges.Event], void> | undefined;
    private _cooldown_action: Action<[AbilityCharges, AbilityCharges.Event], void> | undefined

    private _text = new SimpleText()
}