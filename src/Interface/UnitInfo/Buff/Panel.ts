import * as Frame from "../../../FrameExt";

import { Buff, Container } from "../../../Buff";
import { Vec2 } from '../../../Math'
import { Action, log } from "../../../Utils";

import { InterfaceBuff } from "./Buff";
import { InterfaceBuffTooltip } from "./Tooltip";

export class InterfaceBuffPanel extends Frame.SimpleEmpty {
    constructor(cols: number, rows: number){
        super()
        this.cols = cols
        this.rows = rows

        // this.__tooltip = new InterfaceBuffTooltip()
        // this.__tooltip.parent = this
        // this.__tooltip.visible = false

        this.__buttons = []
        for (let y = 0; y < rows; y++){
            this.__buttons.push([])

            for (let x = 0; x < cols; x++){
                let btn = new InterfaceBuff()
                this.__buttons[y].push(btn)
                btn.parent = this
                // btn.actions.add('MOUSE_ENTER', () => {
                //     this.__tooltip.buff = btn.buff
                //     this.__tooltip.pos = btn.pos.add(btn.size)
                //     this.__tooltip.visible = true
                // })
                // btn.actions.add('MOUSE_LEAVE', ()=>{
                //     this.__tooltip.visible = false
                // })

                // btn.actions.add('CONTROL_CLICK', () => {
                // })
            }
        }

        this.size = this.size
    }

    get buffs(){return this.__buffs}
    set buffs(buffs: Container | undefined){
        if (this.__buffs){
            let removed = this.__buffs.actions.remove(this.__act_added)
            removed = removed && this.__buffs.actions.remove(this.__act_removed)

            if (!removed){
                log(this.toString() + ': can not remove actions of previous buff container.', "Wrn")
            }
        }

        this.__buffs = buffs
        if (buffs){
            this.__act_added = buffs.actions.add('START',
                (e, cont, buff, pos) => {this.__updateBuffs(pos)})
            this.__act_removed = buffs.actions.add('REMOVED',
                (e, cont, buff, pos) => {this.__updateBuffs(pos)})
        }
        this.__updateBuffs()
    }

    destroy(){
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this.__buttons[x][y].destroy()
            }
        }
        // this.__tooltip.destroy()
        
        if (this.__buffs){
            this.__buffs.actions.remove(this.__act_added)
            this.__buffs.actions.remove(this.__act_removed)
        }
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
    
    protected __updateBuffs(start_pos: number = 0){
        let list = this.__buffs ? this.__buffs.list : []

        let s_y = Math.floor(start_pos / this.cols)
        let s_x = start_pos % this.cols

        let i = start_pos
        for (let y = s_y; y < this.rows; y++){
            for (let x = s_x; x < this.cols; x++){
                this.__buttons[y][x].buff = list[i]
                i++
            }
        }
    }

    readonly cols: number
    readonly rows: number

    private __buffs: Container | undefined
    private __act_added: ContAct | undefined
    private __act_removed: ContAct | undefined
    
    private __buttons: InterfaceBuff[][]
    // private __tooltip: InterfaceBuffTooltip
}

type ContAct = Action<[Container.Event, Container, Buff<any>, number], void> 