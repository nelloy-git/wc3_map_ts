import { BuffIFace } from "../../Buff";
import { Backdrop } from "../../FrameExt";
import { InterfaceBuff } from "./Buff";

export class InterfaceBuffPanel extends Backdrop {
    constructor(cols: number, rows: number){
        super()
        this.cols = cols
        this.rows = rows

        this.alpha = 0
        for (let y = 0; y < rows; y++){
            this._buffs.push([])

            for (let x = 0; x < cols; x++){
                let btn = new InterfaceBuff()
                btn.parent = this
                this._buffs[y].push(btn)
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
                this._buffs[y][x].pos = [x0, y0]
                this._buffs[y][x].size = [w, h]
                x0 += w
            }
            x0 = 0
            y0 += h
        }
    }

    setBuff(x: number, y: number, buff: BuffIFace | undefined){
        this._buffs[y][x].buff = buff
    }

    readonly cols: number
    readonly rows: number
    private _buffs: InterfaceBuff[][] = []
}