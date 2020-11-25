import { Color, Log } from "../../../Utils";
import { Fdf } from "../../Fdf";

export class FdfSimpleString extends Fdf {
    constructor(name: string){
        super(name, 'String', true)
    }

    public get text(){return this._text}
    public set text(text: string){
        this._setParam('Text', '\"' + text + '\"')
        this._text = text
    }

    public get font(){return this._font}
    public set font(path: string){
        this._setParam('Font', '\"' + path + '\", ' + this._font_size.toString())
        this._font = path
    }

    public get fontSize(){return this._font_size}
    public set fontSize(size: number){
        this._setParam('Font', '\"' + this._font + '\", ' + size.toString())
        this._font_size = size
    }

    public get color(){return new Color(this._color)}
    public set color(c: Color){
        this._setParam('FontColor', string.format('%f %f %f %f', c.r, c.g, c.b, c.a))
        this._color = new Color(c)
    }

    public addSubframe(){
        return Log.err(FdfSimpleString.name + 
                       ': can not have subframes.', 2)
    }
    public getSubframe(){
        return Log.err(FdfSimpleString.name + 
                       ': can not have subframes.', 2)
    }
    public removeSubframe(){
        return Log.err(FdfSimpleString.name + 
                       ': can not have subframes.', 2)
    }

    public serialize(){
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