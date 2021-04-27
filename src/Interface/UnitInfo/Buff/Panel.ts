import * as Frame from "../../../FrameExt";

import { Buff, Container } from "../../../Buff";
import { Vec2 } from '../../../Math'
import { log } from "../../../Utils";

import { InterfaceBuff } from "./Buff";
import { InterfaceBuffTooltip } from "./Tooltip";

export class InterfaceBuffPanel extends Frame.SimpleEmpty {
    constructor(cols: number, rows: number){
        super()
        this.cols = cols
        this.rows = rows
        this.__buffs_event_map = new Map([
            ['START', () => {this.__updateBuffs()}],
            ['CANCEL', () => {this.__updateBuffs()}],
            ['FINISH', () => {this.__updateBuffs()}]
        ])

        this.__tooltip = new InterfaceBuffTooltip()
        this.__tooltip.parent = this
        this.__tooltip.visible = false

        this.__buttons = []
        for (let y = 0; y < rows; y++){
            this.__buttons.push([])

            for (let x = 0; x < cols; x++){
                let btn = new InterfaceBuff()
                this.__buttons[y].push(btn)
                btn.parent = this
                btn.actions.add('MOUSE_ENTER', () => {
                    this.__tooltip.buff = btn.buff
                    this.__tooltip.pos = btn.pos.add(btn.size)
                    this.__tooltip.visible = true
                })
                btn.actions.add('MOUSE_LEAVE', ()=>{
                    this.__tooltip.visible = false
                })

                // btn.actions.add('CONTROL_CLICK', () => {
                // })
            }
        }

        this.size = this.size
    }

    get buffs(){return this.__buffs}
    set buffs(buffs: Container | undefined){
        if (this.__buffs){
            let removed = this.__buffs.actions.removeMap(this.__buffs_event_map)
            if (!removed){
                log(this.toString() + ': can not remove actions of previous buff container.', "Wrn")
            }
        }

        this.__buffs = buffs
        if (buffs){
            buffs.actions.addMap(this.__buffs_event_map)
        }
        this.__updateBuffs()
    }

    destroy(){
        for (let y = 0; y < this.rows; y++){
            for (let x = 0; x < this.cols; x++){
                this.__buttons[x][y].destroy()
            }
        }
        this.__tooltip.destroy()
        if (this.__buffs){
            this.__buffs.actions.removeMap(this.__buffs_event_map)
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
    
    protected __updateBuffs(){
        let list = this.__buffs ? this.__buffs.list : []

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

    private __buffs: Container | undefined
    private readonly __buffs_event_map: Map<Container.Event, (e: Container.Event, c: Container, b: Buff<any>) => void>
    
    private __buttons: InterfaceBuff[][]
    private __tooltip: InterfaceBuffTooltip
}