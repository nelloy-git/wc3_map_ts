import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt"
import * as Fdf from '../../Fdf'
import * as WcIO from '../../WcIO'
import { Vec2 } from '../../Utils'

import { InterfaceBorderFdf } from '../Utils/BorderFdf'

const NAME_LINE_HEIGHT = 0.015
const TOOL_LINE_HEIGHT = 0.012

const NAME_CHAR_WIDTH = 0.007
const TOOL_CHAR_WIDTH = 0.006

export class InterfaceAbilityTooltip extends Frame.Backdrop {
    constructor(){
        super(InterfaceBorderFdf)

        this.__name = new Frame.Text(NameFdf)
        this.__name.parent = this

        this.__tooltip = new Frame.Text(TooltipFdf)
        this.__tooltip.parent = this.__name
        this.__formula = false

        this.size = this.size

        WcIO.Keyboard.addAction((pl, key, meta, is_down)=>{
            if (pl != GetLocalPlayer() || key != OSKEY_LCONTROL){return}
            this.__formula = is_down
            this.__updateTooltip()
        })
    }

    get name(){return this.__name}
    get tooltip(){return this.__tooltip}

    get ability(){return this.__ability}
    set ability(abil: Abil.Ability<any> | undefined){
        this.__ability = abil
        this.__updateTooltip()
    }

    // Autosized frame
    protected _set_size(s: Vec2){
    }

    private __updateTooltip(){
        if (!this.__ability){
            this.__name.text = ''
            this.__tooltip.text = ''
            return
        }

        let abil_name = this.__ability.Data.name + '\n'
        let abil_tooltip = this.__formula ? this.__ability.Data.tooltipFull : this.__ability.Data.tooltip

        let max_chars = -1
        let name_lines = abil_name.split('\n')
        for (let line of name_lines){
            max_chars = math.max(max_chars, line.length)
        }
        let name_w = max_chars * NAME_CHAR_WIDTH
        let name_h = name_lines.length * NAME_LINE_HEIGHT

        max_chars = -1
        let tool_lines = abil_tooltip.split('\n')
        for (let line of tool_lines){
            max_chars = math.max(max_chars, line.length)
        }
        let tool_w = max_chars * TOOL_CHAR_WIDTH
        let tool_h = tool_lines.length * TOOL_LINE_HEIGHT

        let w = 1.1 * math.max(name_w, tool_w)
        let h = 1.1 * (name_h + tool_h)
        let size = new Vec2(w, h)
        
        super._set_size(size)

        this.__name.pos = new Vec2(0.05 * w, 0.05 * h)
        this.__name.size = new Vec2(0.9 * w, name_h)
        this.__name.text = abil_name

        this.__tooltip.pos = new Vec2(0, name_h)
        this.__tooltip.size = new Vec2(0.9 * w, tool_h)
        this.__tooltip.text = abil_tooltip
    }

    private __name: Frame.Text
    private __tooltip: Frame.Text
    private __ability: Abil.Ability<any> | undefined
    private __formula: boolean
}

const NameFdf = new Fdf.Text(InterfaceAbilityTooltip.name + 'Name')
NameFdf.width = 0.04
NameFdf.height = 0.04
NameFdf.font = 'fonts\\nim_____.ttf'
NameFdf.fontSize = 0.9 * NAME_LINE_HEIGHT
NameFdf.justification = ['JUSTIFYLEFT', 'JUSTIFYMIDDLE']

const TooltipFdf = new Fdf.Text(InterfaceAbilityTooltip.name + 'Tooltip')
TooltipFdf.width = 0.04
TooltipFdf.height = 0.04
TooltipFdf.font = 'fonts\\nim_____.ttf'
TooltipFdf.fontSize = 0.9 * TOOL_LINE_HEIGHT
TooltipFdf.justification = ['JUSTIFYLEFT', 'JUSTIFYMIDDLE']