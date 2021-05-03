import { Abil } from "../../Abil";
import * as Frame from "../../FrameExt";
import { Vec2 } from '../../Math'
import { Action, log } from '../../Utils'

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
    set ability(abil: Abil<any> | undefined){
        if (this.__abil){
            let removed = true

            removed = removed && this.__abil.actions.remove(this.__action_added)
            removed = removed && this.__abil.actions.remove(this.__action_loop)
            removed = removed && this.__abil.actions.remove(this.__action_removed)

            if (!removed){
                log(this.toString() + ': can not remove actions from previous ability ' +
                    this.__abil.toString() + '.', 'Wrn')
            }
        }

        this.__abil = abil
        this.visible = abil != undefined
        if (!abil){
            return
        }

        this.__action_added = abil.actions.add('CHARGES_ADDED', () => {this.__chargesChanged(abil)})
        this.__action_removed = abil.actions.add('CHARGES_REMOVED', () => {this.__chargesChanged(abil)})
        this.__action_loop = abil.actions.add('CHARGES_LOOP', () => {this.__cooldownLoop(abil)})

        this.__chargesChanged(abil)
        this.__cooldownLoop(abil)
    }

    protected _get_size(){return this.__full_size}
    protected _set_size(size: Vec2){
        this.__full_size = size.copy()

        this.__text.size = size
        this.__text.fontSize = 0.35 * size.y
        
        if (this.__abil){
            this.__chargesChanged(this.__abil)
            this.__cooldownLoop(this.__abil)
        }
    }

    protected _set_visible(f: boolean){
        super._set_visible(f && (this.__abil != undefined))
    }

    private __chargesChanged(abil: Abil<any>){
        let color = this.color
        let cur = abil.Charges.cur
        color.a = cur < 1 ? 0.85 : 0.35
        this.color = color
        this.__text.visible = cur != abil.Charges.max
    }

    private __cooldownLoop(abil: Abil<any>){
        let left = abil.Charges.left_cd
        if (left <= 0){
            this.__text.text = ''
            return
        }

        let full = abil.Charges.cd
        this.__cd_part = left / full

        let s = this.__full_size
        s.x = this.__cd_part * s.x
        super._set_size(s)
        this.__text.text = string.format('%.1f', left)
    }

    private __full_size: Vec2

    private __cd_part: number = 0
    private __abil: Abil<any> | undefined
    private __action_added: Action<[Abil.Event, Abil<any>], void> | undefined
    private __action_removed: Action<[Abil.Event, Abil<any>], void> | undefined
    private __action_loop: Action<[Abil.Event, Abil<any>], void> | undefined

    private __text: Frame.SimpleText
}