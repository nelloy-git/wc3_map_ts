import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt"
import * as Fdf from '../../Fdf'
import { Color, Vec2 } from '../../Utils'

import { InterfaceBorderFdf } from '../Utils/BorderFdf'

const NAME_LINE_HEIGHT = 0.015
const TOOL_LINE_HEIGHT = 0.012

const NAME_CHAR_WIDTH = 0.008
const TOOL_CHAR_WIDTH = 0.006

const CHARS_PER_LINE = 30

const NAME_COLOR = new Color(0.8, 0.8, 0, 1)

export class InterfaceAbilityTooltip extends Frame.Backdrop {
    constructor(){
        super(InterfaceBorderFdf)

        this.__name = new Frame.Text(NameFdf)
        this.__name.parent = this

        this.__tooltip = new Frame.Text(TooltipFdf)
        this.__tooltip.parent = this.__name
        this.full = false

        this.size = this.size
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

        let abil_name = this.__ability.Data.name
        let abil_tool = this.full ? this.__ability.Data.tooltipFull : this.__ability.Data.tooltip

        let [name, name_chars, name_lines] = this.__splitLines(abil_name)
        let [tool, tool_chars, tool_lines] = this.__splitLines(abil_tool)

        let name_w = name_chars * NAME_CHAR_WIDTH
        let name_h = name_lines * NAME_LINE_HEIGHT

        let tool_w = tool_chars * TOOL_CHAR_WIDTH
        let tool_h = tool_lines * TOOL_LINE_HEIGHT

        let w = 1.1 * math.max(name_w, tool_w)
        let h = 1.1 * (name_h + tool_h)
        let size = new Vec2(w, h)
        
        super._set_size(size)

        this.__name.pos = new Vec2(0.05 * w, 0.05 * h)
        this.__name.size = new Vec2(0.9 * w, name_h)
        this.__name.text = NAME_COLOR.colorText(name)

        this.__tooltip.pos = new Vec2(0, name_h)
        this.__tooltip.size = new Vec2(0.9 * w, tool_h)
        this.__tooltip.text = tool
    }

    private __splitLines(str: string){
        let _
        [str, _] = string.gsub(str, '\t', ' ');
        [str, _] = string.gsub(str, '\n', '\n ')
        let words = str.split(' ')
        let lines = ['']
        
        let max_chars = -1
        for (const word of words){
            let len = lines.length - 1
            lines[len] += word + ' '

            if (lines[len].length > CHARS_PER_LINE || word.endsWith('\n')){
                if (word.endsWith('\n')){
                    lines[len] = lines[len].slice(0, lines[len].length - 2)    
                }
                
                lines.push('')
            }

            max_chars = math.max(max_chars, lines[len].length)
        }

        let splitted = ''
        for (const line of lines){
            splitted += line + '\n'
        }

        return $multi(splitted, max_chars, lines.length)
    }

    full: boolean

    private __name: Frame.Text
    private __tooltip: Frame.Text
    private __ability: Abil.Ability<any> | undefined
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