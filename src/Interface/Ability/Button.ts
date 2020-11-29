import { Ability } from "../../AbilityExt";
import { Backdrop, GlueTextButton } from '../../FrameExt'
import { InterfaceAbilityCharges } from "./Charges";
import { InterfaceAbilityCooldown } from "./Cooldown";

export class InterfaceAbilityButton extends GlueTextButton {
    constructor(){
        super()

        this._charges.parent = this
        this._charges.visible = false
        this._charges.pos = [0, 0]
        this._charges.level = this.level + 1

        this._cooldown.parent = this
        this._cooldown.visible = false
        this._cooldown.pos = [0, 0]

        this.size = this.size
    }

    get size(){return this._get_size()}
    set size(size: [number, number]){
        this._set_size(size)

        this._charges.size = [0.3 * size[0], 0.25 * size[1]]
        this._charges.pos = [0, 0.75 * size[1]]

        this._cooldown.size = size
    }

    get ability(){return this._abil}
    set ability(abil: Ability | undefined){
        this._abil = abil

        this._charges.ability = abil

        this.visible = abil != undefined
        let icon = this.getElement('NORMAL') as Backdrop | undefined
        if (icon){icon.texture = abil?.type.data.iconNormal(abil)}
    }

    private _abil: Ability | undefined

    private _charges = new InterfaceAbilityCharges()
    private _cooldown = new InterfaceAbilityCooldown()
}