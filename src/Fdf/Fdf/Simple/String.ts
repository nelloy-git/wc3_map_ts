import { Color } from "../../../Utils";
import { Fdf } from "../../Fdf";

export class SimpleString extends Fdf {
    constructor(name: string){
        super(name, 'String', true)
    }

    get text(){return this._text}
    set text(text: string){
        this._setParam('Text', '\"' + text + '\"')
        this._text = text
    }

    get font(){return this._font}
    set font(path: string){
        this._setParam('Font', '\"' + path + '\", ' + this._font_size.toString())
        this._font = path
    }

    get fontSize(){return this._font_size}
    set fontSize(size: number){
        this._setParam('Font', '\"' + this._font + '\", ' + size.toString())
        this._font_size = size
    }

    get color(){return this._color.copy()}
    set color(c: Color){
        this._setParam('FontColor', string.format('%f %f %f %f', c.r, c.g, c.b, c.a))
        this._color = c.copy()
    }

    addSubframe(){
        return error(this.toString() + ': can not have subframes.', 2)
    }
    getSubframe(){
        return error(this.toString() + ': can not have subframes.', 2)
    }
    removeSubframe(){
        return error(this.toString() + ': can not have subframes.', 2)
    }

    serialize(){
        let res = string.format("%s \"%s\" {\n", this.base_type, this.name)
        for (let [param, value] of this._parameters){
            res += '    ' + param + ' ' + value + ',\n'
        }
        res += '}'
        return res
    }

    private _text: string = ''
    private _font: string = ''
    private _font_size: number = 0.01
    private _color: Color = new Color(1, 1, 1, 1)
}