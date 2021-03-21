import * as Buff from "../../../Buff";
import * as Frame from "../../../FrameExt";
import { Action, Vec2 } from "../../../Utils";

import { IUnit } from "../../Unit";
import { InterfaceBuff } from "./Buff";

export class InterfaceBuffPanel extends Frame.SimpleEmpty {
    constructor(cols: number, rows: number){
        super()
        this.cols = cols
        this.rows = rows

        for (let y = 0; y < rows; y++){
            this.__buttons.push([])

            for (let x = 0; x < cols; x++){
                let btn = new InterfaceBuff()
                btn.parent = this
                this.__buttons[y].push(btn)
            }
        }

        this.size = this.size
    }

    get unit(){return this.__unit}
    set unit(u: IUnit | undefined){
        if (this.__unit){
            this.__unit.buffs.removeAction(this.__buffs_changed)
        }

        this.__unit = u
        if (!u){return}

        let buffs = u.buffs
        this.__buffs_changed = buffs.addAction('LIST_CHANGED', buffs => {this._updateBuffs(buffs)})
        this._updateBuffs(buffs)
    }

    protected _set_size(size: Vec2){
        super._set_size(size)

        let w = size.x / this.cols
        let h = size.y / this.rows
        let btn_size = new Vec2(w, h)

        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this.__buttons[y][x].pos = new Vec2(x * w, y * h)
                this.__buttons[y][x].size = btn_size
            }
        }
    }

    // protected _set_visible(flag: boolean){
    //     super._set_visible(flag)

    //     if (flag){
    //         for (let y = 0; y < this.rows; y++){
    //             for (let x = 0; x < this.cols; x++){
    //                 let cur = this._buttons[y][x]
    //                 if (cur.buff == undefined){
    //                     cur.visible = false
    //                 }
    //             }
    //         }
    //     }
    // }
    
    protected _updateBuffs(buffs: Buff.Container){
        let list = buffs.list

        let i = 0
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this.__buttons[y][x].buff = list[i]
                i++
            }
        }
    }

    readonly cols: number
    readonly rows: number

    private __unit: IUnit | undefined;
    private __buffs_changed: Action<[Buff.Container, Buff.Container.Event], void> | undefined
    
    private __buttons: InterfaceBuff[][] = []
}