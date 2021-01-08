import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt";

import { hUnit } from "../../Handle";
import { UnitExt } from "../../UnitExt/UnitExt";
import { Action } from "../../Utils";

import { InterfaceBorderFdf } from "../Utils/BorderFdf"
import { InterfaceAbilityButton } from "./Button";

export class InterfaceAbilityPanel extends Frame.SimpleEmpty {
    constructor(cols: number, rows: number){
        super()
        this.cols = cols
        this.rows = rows

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
    set unit(u: UnitExt | undefined){
        if (this._unit){
            this._unit.abils.removeAction(this._abils_changed)
        }

        this._unit = u
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

    protected _set_visible(flag:boolean){
        super._set_visible(flag)
    }

    protected _update(abils: Abil.Container){
        let list = abils.list

        let i = 0
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this._buttons[y][x].ability = list[i]
                i++
            }
        }
    }

    readonly cols: number
    readonly rows: number

    private _unit: UnitExt | undefined
    private _abils_changed: Action<[Abil.Container], void> | undefined

    private _backgrounds: Frame.Backdrop[][] = [];
    private _buttons: InterfaceAbilityButton[][] = []
}