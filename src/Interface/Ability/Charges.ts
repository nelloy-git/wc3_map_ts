import { Abil } from "../../Abil";
import * as Frame from "../../FrameExt";
import { Vec2 } from '../../Math'
import { Action, log } from '../../Utils'

export class InterfaceAbilityCharges extends Frame.Backdrop {
    constructor(){
        super()
        
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'

        this.__text.parent = this
        this.__text.pos = new Vec2(0, 0)
        this.__text.size = this.size
        this.__text.font = 'fonts\\nim_____.ttf'
    }

    get ability(){return this.__abil}
    set ability(abil: Abil<any> | undefined){
        if (this.__abil){
            let removed = this.__abil.actions.remove(this.__action_added)
            removed = removed && this.__abil.actions.remove(this.__action_removed)
            
            if (!removed){
                log(this.toString() + ': can not remove actions from previous ability.', 'Wrn')
            }
        }

        this.__abil = abil
        this.__is_visible = false
        if (!abil){
            return
        }

        this.__action_added = abil.actions.add('CHARGES_ADDED', () => {this.__chargesChanged(abil)})
        this.__action_removed = abil.actions.add('CHARGES_REMOVED', () => {this.__chargesChanged(abil)})
        this.__chargesChanged(abil)
    }

    protected _set_size(size: Vec2){
        super._set_size(size)
        this.__text.size = size
        this.__text.fontSize = 0.8 * size.y
    }

    protected _set_visible(flag: boolean){
        super._set_visible(flag && this.__is_visible)
    }

    private __chargesChanged(abil: Abil<any>){
        let max = abil.Charges.max
        this.__is_visible = max > 1
        this.visible = this.parent ? this.parent.visible : true
        
        if (max > 1){
            let left = Math.floor(abil.Charges.cur).toString()
            this.__text.text = left
        }
    }

    private __abil: Abil<any> | undefined;
    private __action_added: Action<[Abil.Event, Abil<any>], void> | undefined;
    private __action_removed: Action<[Abil.Event, Abil<any>], void> | undefined;

    private __is_visible = false
    private __text = new Frame.SimpleText()
}