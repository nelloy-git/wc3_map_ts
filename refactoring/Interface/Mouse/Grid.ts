import * as Frame from '../../FrameExt'
import { Color, Vec2 } from '../../Utils'

const COLOR = new Color(0, 0, 0, 0)

export class MouseDetectGrid extends Frame.SimpleEmpty {
    constructor(cols: number, rows: number){
        super()
        
        this.__grid_btn = []
        this.__grid_tool = []
        for (let x = 0; x < cols; x++){
            this.__grid_btn.push([])
            this.__grid_tool.push([])
            for (let y = 0; y < rows; y++){
                let btn = new Frame.GlueTextButton()
                this.__grid_btn[x].push(btn)
                btn.parent = this
                btn.color = COLOR

                let tool = new Frame.Backdrop()
                this.__grid_tool[x].push(tool)
                tool.visible = false
                tool.color = COLOR
                BlzFrameSetTooltip(btn.handle, tool.handle)
            }
        }
    }

    getMousePos(){
        for (let x = 0; x < this.__grid_btn.length; x++){
            for (let y = 0; y < this.__grid_btn[x].length; y++){
                let tool = this.__grid_tool[x][y]
                if (tool.visible){
                    let btn = this.__grid_btn[x][y]
                    return $multi(true, this.pos.add(btn.pos), btn.size)
                }
            }
        }
        return $multi(false, this.pos, this.size)
    }

    protected _set_size(size: Vec2){
        super._set_size(size)

        let btn_size = new Vec2(size.x / this.__grid_btn.length,
                                size.y / this.__grid_btn[0].length)
        for (let x = 0; x < this.__grid_btn.length; x++){
            for (let y = 0; y < this.__grid_btn[x].length; y++){
                this.__grid_btn[x][y].size = btn_size
                this.__grid_btn[x][y].pos = new Vec2(x * btn_size.x, y * btn_size.y)
            }
        }

    }

    private __grid_btn: Frame.GlueTextButton[][]
    private __grid_tool: Frame.Backdrop[][]
}