import * as Buff from "../../../Buff";
import * as Frame from "../../../FrameExt"
import * as Fdf from '../../../Fdf'
import { Color, Vec2 } from '../../../Utils'

import { InterfaceBorderFdf } from '../../Utils/BorderFdf'
import { hTimer } from "../../../Handle";

const NAME_LINE_HEIGHT = 0.015
const TOOL_LINE_HEIGHT = 0.012
const DUR_LINE_HEIGHT = 0.012

const NAME_CHAR_WIDTH = 0.008
const TOOL_CHAR_WIDTH = 0.006
const DUR_CHAR_WIDTH = 0.006

const CHARS_PER_LINE = 35

const NAME_COLOR = new Color(0.8, 0.8, 0, 1)

export class InterfaceBuffTooltip extends Frame.Backdrop {
    constructor(){
        super(InterfaceBorderFdf)

        this.__name = new Frame.Text(NameFdf)
        this.__name.parent = this

        this.__tooltip = new Frame.Text(TooltipFdf)
        this.__tooltip.parent = this.__name

        this.__duration = new Frame.Text(DurationFdf)
        this.__duration.parent = this.__tooltip

        this.__timer = new hTimer()
        this.__timer.addAction(() => {this.__updateDuration()})
        this.__timer.start(0.1, true)

        this.size = this.size
    }

    get name(){return this.__name}
    get tooltip(){return this.__tooltip}

    get buff(){return this.__buff}
    set buff(buff: Buff.IFace<any> | undefined){
        this.__buff = buff
        this.__updateTooltip()
    }

    // Autosized frame
    protected _set_size(s: Vec2){
    }

    private __updateTooltip(){
        if (!this.__buff){
            this.__name.text = ''
            this.__tooltip.text = ''
            return
        }

        let buff_name = this.__buff.Data.name
        let buff_tool = this.__buff.Data.tooltip

        print('Name:', buff_name)

        let [name, name_chars, name_lines] = this.__splitLines(buff_name)
        let [tool, tool_chars, tool_lines] = this.__splitLines(buff_tool)

        let name_w = name_chars * NAME_CHAR_WIDTH
        let name_h = name_lines * NAME_LINE_HEIGHT

        let tool_w = tool_chars * TOOL_CHAR_WIDTH
        let tool_h = tool_lines * TOOL_LINE_HEIGHT

        let w = 1.1 * math.max(name_w, tool_w)
        let h = 1.15 * (name_h + tool_h + DUR_LINE_HEIGHT)
        let size = new Vec2(w, h)
        
        super._set_size(size)

        this.__name.pos = new Vec2(0.05 * w, 0.05 * h)
        this.__name.size = new Vec2(0.9 * w, name_h)
        this.__name.text = NAME_COLOR.colorText(name)

        this.__tooltip.pos = new Vec2(0, name_h)
        this.__tooltip.size = new Vec2(0.9 * w, tool_h)
        this.__tooltip.text = tool

        this.__duration.pos = new Vec2(0, 0)
        this.__duration.size = new Vec2(0.9 * w, DUR_LINE_HEIGHT)

        this.__updateDuration()
    }

    private __updateDuration(){
        if (!this.__buff){
            return
        }

        let left =  this.__buff.Dur.Timer.left
        this.__duration.text = string.format('%.1f sec', left)
    }

    private __splitLines(str: string){
        let _
        [str, _] = string.gsub(str, "%s+", " ");
        [str, _] = string.gsub(str, '\t', ' ');
        [str, _] = string.gsub(str, '\n', '\n ')
        let words = str.split(' ')
        let lines = ['']
        
        let max_chars = -1
        for (const word of words){
            let cur = lines.length - 1
            lines[cur] += word + ' '

            let color_len = 0
            if (lines[cur].includes('|c')){
                color_len += 10
            }
            if (lines[cur].includes('|r')){
                color_len += 2
            }

            max_chars = math.max(max_chars, lines[cur].length - color_len)

            if (word.endsWith('\n')){
                lines[cur] = lines[cur].slice(0, lines[cur].length - 2)
                lines.push('')
                continue
            }

            if (lines[cur].length - color_len > CHARS_PER_LINE){
                lines.push('')
            }
        }

        let splitted = ''
        for (const line of lines){
            splitted += line + '\n'
        }

        return $multi(splitted, max_chars, lines.length)
    }

    private __name: Frame.Text
    private __tooltip: Frame.Text
    private __duration: Frame.Text
    private __timer: hTimer

    private __buff: Buff.IFace<any> | undefined
}

const NameFdf = new Fdf.Text(InterfaceBuffTooltip.name + 'Name')
NameFdf.width = 0.04
NameFdf.height = 0.04
NameFdf.font = 'fonts\\nim_____.ttf'
NameFdf.fontSize = 0.9 * NAME_LINE_HEIGHT
NameFdf.justification = ['JUSTIFYLEFT', 'JUSTIFYMIDDLE']

const TooltipFdf = new Fdf.Text(InterfaceBuffTooltip.name + 'Tooltip')
TooltipFdf.width = 0.04
TooltipFdf.height = 0.04
TooltipFdf.font = 'fonts\\nim_____.ttf'
TooltipFdf.fontSize = 0.9 * TOOL_LINE_HEIGHT
TooltipFdf.justification = ['JUSTIFYLEFT', 'JUSTIFYMIDDLE']

const DurationFdf = new Fdf.Text(InterfaceBuffTooltip.name + 'Duration')
DurationFdf.width = 0.04
DurationFdf.height = 0.04
DurationFdf.font = 'fonts\\nim_____.ttf'
DurationFdf.fontSize = 0.9 * DUR_LINE_HEIGHT
DurationFdf.justification = ['JUSTIFYRIGHT', 'JUSTIFYMIDDLE']