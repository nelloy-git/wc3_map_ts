import * as Buff from "../../../Buff";
import * as Frame from "../../../FrameExt";

import { UnitInst } from "../../../Gameplay/Units/UnitType";
import { Action } from "../../../Utils";
import { InterfaceBuff } from "./Buff";

export class InterfaceBuffPanel extends Frame.SimpleEmpty {
    constructor(cols: number, rows: number){
        super()
        this.cols = cols
        this.rows = rows

        for (let y = 0; y < rows; y++){
            this._buttons.push([])

            for (let x = 0; x < cols; x++){
                let btn = new InterfaceBuff()
                btn.parent = this
                this._buttons[y].push(btn)
            }
        }

        this.size = this.size
    }

    get unit(){return this._unit}
    set unit(u: UnitInst | undefined){
        if (this._unit){
            this._unit.buffs.removeAction(this._buffs_changed)
        }

        this._unit = u
        if (!u){return}

        let b = u.buffs
        this._buffs_changed = b.addAction('LIST_CHANGED', b => {this._update(b)})
        this._update(b)
    }

    protected _set_size(size: [w: number, h: number]){
        super._set_size(size)

        let x0 = 0
        let y0 = 0
        let w = size[0] / this.cols
        let h = size[1] / this.rows

        for (let y = 0; y < this.rows; y++){
            x0 = 0
            for (let x = 0; x < this.cols; x++){
                this._buttons[y][x].pos = [x0, y0]
                this._buttons[y][x].size = [w, h]
                x0 += w
            }
            y0 += h
        }
    }

    protected _set_visible(flag: boolean){
        super._set_visible(flag)

        if (flag){
            for (let y = 0; y < this.rows; y++){
                for (let x = 0; x < this.cols; x++){
                    let cur = this._buttons[y][x]
                    if (cur.buff == undefined){
                        cur.visible = false
                    }
                }
            }
        }
    }
    
    protected _update(buffs: Buff.Container){
        let list = buffs.list

        let i = 0
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this._buttons[y][x].buff = list[i]
                i++
            }
        }
    }

    readonly cols: number
    readonly rows: number

    private _unit: UnitInst | undefined;
    private _buffs_changed: Action<[Buff.Container, Buff.Container.Event], void> | undefined
    
    private _buttons: InterfaceBuff[][] = []
}