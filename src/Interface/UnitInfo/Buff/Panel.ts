import * as Buff from "../../../Buff";
import * as Frame from "../../../FrameExt";
import { hUnit } from "../../../Handle";
import { Action } from "../../../Utils";
import { InterfaceBuff } from "./Buff";

export class InterfaceBuffPanel extends Frame.Backdrop {
    constructor(cols: number, rows: number){
        super()
        this.cols = cols
        this.rows = rows

        this.alpha = 0
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

    protected _set_size(size: [number, number]){
        super._set_size(size)

        let x0 = 0
        let y0 = 0
        let w = size[0] / this.cols
        let h = size[1] / this.rows

        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this._buttons[y][x].pos = [x0, y0]
                this._buttons[y][x].size = [w, h]
                x0 += w
            }
            x0 = 0
            y0 += h
        }
    }

    get unit(){return this._unit}
    set unit(u: hUnit | undefined){
        if (this._buffs){
            this._buffs.removeAction(this._buffs_changed)
        }

        this._buffs = Buff.Container.get(u)
        if (this._buffs){
            this._buffs_changed = this._buffs.addAction(()=>{this._update()})    
        }
        this._update()
    }
    
    protected _update(){
        let list = this._buffs ? this._buffs.getList(this.rows * this.cols) : []

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

    private _unit: hUnit | undefined;
    private _buffs: Buff.Container | undefined
    private _buffs_changed: Action<[Buff.Container], void> | undefined
    
    private _buttons: InterfaceBuff[][] = []
}