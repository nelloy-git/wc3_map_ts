import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt";
import * as WcIO from '../../WcIO'
import { Action, Vec2 } from '../../Utils'

import { InterfaceBorderFdf } from "../Utils/BorderFdf"
import { InterfaceAbilityButton } from "./Button";
import { InterfaceCastingBar } from "./CastingBar";
import { IUnit } from "../Unit";

export class InterfaceAbilityPanel extends Frame.SimpleEmpty {
    constructor(cols: number, rows: number){
        super()
        this.cols = cols
        this.rows = rows

        this.__casting_bar = new InterfaceCastingBar()
        this.__casting_bar.parent = this

        this.__backgrounds = []
        this.__buttons = []
        for (let y = 0; y < rows; y++){
            this.__backgrounds.push([])
            this.__buttons.push([])

            for (let x = 0; x < cols; x++){
                let back = new Frame.Backdrop(InterfaceBorderFdf)
                this.__backgrounds[y].push(back)
                back.parent = this

                let btn = new InterfaceAbilityButton()
                this.__buttons[y].push(btn)
                btn.parent = back
            }
        }
        this.size = this.size
    }

    get unit(){return this.__unit}
    set unit(u: IUnit | undefined){
        if (this.__unit){
            this.__unit.abils.removeAction(this.__abils_changed)
        }

        this.__unit = u
        this.__casting_bar.unit = u
        this.visible = u != undefined

        let abils = u ? u.abils : undefined
        if (abils){
            abils.addAction('LIST_CHANGED', abil => {this._updateAbil(abil)})
        }
        this._updateAbil(abils)
    }

    setKey(x: number, y: number, key: joskeytype | undefined){
        this.__buttons[y][x].key = key
    }

    protected _set_size(size: Vec2){
        super._set_size(size)

        this.__casting_bar.pos = new Vec2(size.x / 4, -size.y / 4)
        this.__casting_bar.size = new Vec2(size.x / 2, size.y / 4)

        let back_size = new Vec2(size.x / this.cols, size.y / this.rows)
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this.__backgrounds[y][x].pos = new Vec2(x * back_size.x, y * back_size.y)
                this.__backgrounds[y][x].size = back_size

                this.__buttons[y][x].pos = back_size.mult(0.1)
                this.__buttons[y][x].size = back_size.mult(0.8)
            }
        }
    }

    protected _set_visible(f: boolean){
        super._set_visible(f && (this.__unit != undefined))
    }

    protected _updateAbil(abils: Abil.Container | undefined){
        let list = abils ? abils.list : undefined

        let i = 0
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                const abil = list ? list.get(i) : undefined
                this.__buttons[y][x].ability = abil
                i++
            }
        }
    }

    readonly cols: number
    readonly rows: number

    private __unit: IUnit | undefined
    private __abils_changed: Action<[Abil.Container], void> | undefined

    private __casting_bar: InterfaceCastingBar
    private __backgrounds: Frame.Backdrop[][]
    private __buttons: InterfaceAbilityButton[][]

    private _mouse_control = WcIO.Mouse.addAction('UP', (event, pl, btn) => {
        if (btn == MOUSE_BUTTON_TYPE_LEFT){
            let active_targ = Abil.TTargeting.activeAbility(pl)
            if (active_targ){
                active_targ.Targeting.finish(pl)
            }
        } else if (btn == MOUSE_BUTTON_TYPE_RIGHT){
            if (this.__unit){
                let active_cast = Abil.Casting.getActive(this.__unit.obj)
                if (active_cast){
                    active_cast.Casting.cancel()
                }
            }
        }
    })
}