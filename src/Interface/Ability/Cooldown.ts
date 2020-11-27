import { Action } from '../../Utils'
import { AbilityCharges, AbilityChargesEvent } from "../../AbilityExt";
import { SimpleImage, SimpleText } from "../../FrameExt";

export class InterfaceAbilityCooldown extends SimpleImage {
    constructor(){
        super()

        this._size = this.size
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'

        this._text.parent = this
        this._text.pos = [0, 0]
        this._text.size = this.size
        this._text.font = 'fonts\\nim_____.ttf'
        this._text.fontSize = 0.35 * this.size[1]
    }

    get size(){return this._size}
    set size(size: [number, number]){
        this._size = size
        this._set_size([size[0], this._cd_part * size[1]])

        this._text.size = size
        this._text.fontSize = 0.35 * size[1]
    }

    setCharges(charges: AbilityCharges | undefined){
        this._charges?.removeAction(this._changed_action)
        this._charges?.removeAction(this._cooldown_action)

        this._charges = charges
        if (!charges){this.visible = false; return}

        this.visible = true
        this._changed_action = charges.addAction(AbilityChargesEvent.COUNT_CHANGED,
                                                 (charges: AbilityCharges): void => {
                                                    this._chargesChanged(charges)
                                                })
        this._cooldown_action = charges.addAction(AbilityChargesEvent.COOLDOWN_LOOP,
                                                  (charges: AbilityCharges): void => {
                                                    this._cooldownLoop(charges)
                                                  })
    }

    private _chargesChanged(charges: AbilityCharges){
        let alpha = charges.count < 1 ? 0.85 : 0.25
        this.alpha = alpha
        this._text.alpha = alpha
    }

    private _cooldownLoop(charges: AbilityCharges){
        let left = charges.timeLeft
        let full = charges.cooldown
        this._cd_part = left / full

        this._set_size([this._size[0], this._cd_part * this._size[1]])

        let time = math.floor(left / 0.1)
        let s_time = time.toString()
        s_time = time < 10 ? 
                    s_time.slice(0, s_time.length) + '.' + s_time.slice(s_time.length)
                    : '0.' + time.toString()

        this._text.text = s_time
    }

    private _size: [number, number];

    private _cd_part: number = 0;
    private _charges: AbilityCharges | undefined;
    private _changed_action: Action<[AbilityCharges, AbilityChargesEvent], void> | undefined;
    private _cooldown_action: Action<[AbilityCharges, AbilityChargesEvent], void> | undefined

    private _text = new SimpleText()
}