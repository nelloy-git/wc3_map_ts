// import * as Abil from "../../AbilityExt";
// import * as Frame from "../../FrameExt";
// import { Action, Vec2 } from '../../Utils'

// export class InterfaceAbilityCharges extends Frame.Backdrop {
//     constructor(){
//         super()
        
//         this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'

//         this.__text.parent = this
//         this.__text.pos = new Vec2(0, 0)
//         this.__text.size = this.size
//         this.__text.font = 'fonts\\nim_____.ttf'
//     }

//     get ability(){return this.__abil}
//     set ability(abil: Abil.Ability<any> | undefined){
//         if (this.__abil){
//             this.__abil.Data.Charges.removeAction(this.__charged_action)
//         }

//         this.__abil = abil
//         this.__is_visible = false
//         if (!abil){return}

//         this.__charged_action = abil.Data.Charges.addAction('CHARGE_CHANGED',
//                                                             charges => {this._chargesChanged(charges)})
//         this._chargesChanged(abil.Data.Charges)
//     }

//     protected _set_size(size: Vec2){
//         super._set_size(size)
//         this.__text.size = size
//         this.__text.fontSize = 0.8 * size.y
//     }

//     protected _set_visible(flag: boolean){
//         super._set_visible(flag && this.__is_visible)
//     }

//     private _chargesChanged(charges: Abil.Charges){
//         let max = charges.countMax
//         this.__is_visible = max > 1
//         this.visible = this.parent ? this.parent.visible : true
        
//         if (max > 1){
//             let left = Math.floor(charges.count).toString()
//             this.__text.text = left
//         }
//     }

//     private __abil: Abil.Ability<any> | undefined;
//     private __charged_action: Action<[Abil.Charges, Abil.Charges.Event], void> | undefined;

//     private __is_visible = false
//     private __text = new Frame.SimpleText()
// }