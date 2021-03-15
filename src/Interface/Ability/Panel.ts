import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt";

import { hUnit } from "../../Handle";
import { Mouse } from "../../WcIO";
import { Action } from "../../Utils";

import { InterfaceBorderFdf } from "../Utils/BorderFdf"
import { InterfaceAbilityButton } from "./Button";
import { InterfaceCastingBar } from "./CastingBar";
import { IUnit } from "../Unit";

export class InterfaceAbilityPanel extends Frame.SimpleEmpty {
    constructor(cols: number, rows: number){
        super()
        this.cols = cols
        this.rows = rows

        this._casting_bar = new InterfaceCastingBar()
        this._casting_bar.parent = this

        for (let y = 0; y < rows; y++){
            this._backgrounds.push([])
            this._buttons.push([])

            for (let x = 0; x < cols; x++){
                let back = new Frame.Backdrop(InterfaceBorderFdf)
                back.parent = this
                this._backgrounds[y].push(back)

                let btn = new InterfaceAbilityButton()
                btn.parent = back
                this._buttons[y].push(btn)
            }
        }
        this.size = this.size
    }

    get unit(){return this._unit}
    set unit(u: IUnit | undefined){
        if (this._unit){
            this._unit.abils.removeAction(this._abils_changed)
        }

        this._unit = u
        this._casting_bar.unit = u
        this.visible = (u != undefined)
        if (!u){return}

        let a = u.abils
        a.addAction('LIST_CHANGED', a => {this._update(a)})
        this._update(a)
    }

    setKey(x: number, y: number, key: joskeytype | undefined){
        this._buttons[y][x].key = key
    }

    protected _set_size(size: [number, number]){
        super._set_size(size)

        this._casting_bar.pos = [size[0] / 4, -size[1] / 4]
        this._casting_bar.size = [size[0] / 2, size[1] / 4]

        let w = size[0] / this.cols
        let h = size[1] / this.rows
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this._backgrounds[y][x].pos = [x * w, y * h]
                this._backgrounds[y][x].size = [w, h]

                this._buttons[y][x].pos = [0.1 * w, 0.1 * h]
                this._buttons[y][x].size = [0.8 * w, 0.8 * h]
            }
        }
    }

    protected _update(abils: Abil.Container){
        let list = abils.list

        let i = 0
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this._buttons[y][x].ability = list.get(i)
                i++
            }
        }
    }

    readonly cols: number
    readonly rows: number

    private _unit: IUnit | undefined
    private _abils_changed: Action<[Abil.Container], void> | undefined

    private _casting_bar: InterfaceCastingBar
    private _backgrounds: Frame.Backdrop[][] = []
    private _buttons: InterfaceAbilityButton[][] = []

    private _mouse_control = Mouse.addAction('UP', (event, pl, btn) => {
        if (btn == MOUSE_BUTTON_TYPE_LEFT){
            let active_targ = Abil.TTargeting.activeAbility(pl)
            if (active_targ){
                active_targ.Targeting.finish(pl)
            }
        } else if (btn == MOUSE_BUTTON_TYPE_RIGHT){
            if (this._unit){
                let active_cast = Abil.Casting.getActive(this._unit.obj)
                if (active_cast){
                    active_cast.Casting.cancel()
                }
            }
        }
    })
}