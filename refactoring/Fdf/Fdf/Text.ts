import { Color } from "../../../src/Utils";
import { Fdf } from "../Fdf";

export class Text extends Fdf {
    constructor(name: string){
        super(name, 'TEXT', false)
    }

    public get width(){return this._width}
    public set width(w: number){
        this._setParam('Width', w.toString())
        this._width = w
    }

    public get height(){return this._height}
    public set height(h: number){
        this._setParam('Height', h.toString())
        this._height = h
    }

    public get decorateFileNames(){return this._decorate}
    public set decorateFileNames(flag: boolean){
        if (flag){
            this._setParam('DecorateFileNames')
        } else {
            this._removeParam('DecorateFileNames')
        }
        this._decorate = flag
    }

    public get text(){return this._text}
    public set text(text: string){
        this._setParam('Text',  '\"' + text + '\"')
        this._text = text
    }

    public get font(){return this._font}
    public set font(path: string){
        this._font = path
        this._setParam('FrameFont',
                       string.format('\"%s\", %f, \"\"', this._font, this._font_size))
    }

    public get fontSize(){return this._font_size}
    public set fontSize(size: number){
        this._font_size = size
        this._setParam('FrameFont',
                       string.format('\"%s\", %f, \"\"', this._font, this._font_size))
    }

    public get justification(){return [this._just_horz, this._just_vert]}
    public set justification(val: [FdfText.JustificationHorz, FdfText.JustificationVert]){
        this._just_horz = val[0]
        this._just_vert = val[1]
        
        this._setParam('FontJustificationH', this._just_horz)
        this._setParam('FontJustificationV', this._just_vert)
    }

    private _width: number = -1;
    private _height: number = -1;
    private _decorate: boolean = false;
    private _text: string = ''
    private _font: string = ''
    private _font_size: number = 0.01
    private _just_horz: FdfText.JustificationHorz = 'JUSTIFYCENTER'
    private _just_vert: FdfText.JustificationVert = 'JUSTIFYMIDDLE'
    // TODO
    private _just_offset: [number, number] = [0, 0]
    private _color: Color = new Color(1, 1, 1, 1)
    private _color_highlight: Color = new Color(1, 1, 1, 1)
    private _color_disabled: Color = new Color(1, 1, 1, 1)
    private _color_shadow: Color = new Color(1, 1, 1, 1)
    private _shadow_offset: [number, number] = [0, 0]
}

export namespace FdfText {
    export type JustificationHorz = 'JUSTIFYLEFT'|'JUSTIFYCENTER'|'JUSTIFYRIGHT'
    export type JustificationVert = 'JUSTIFYTOP'|'JUSTIFYMIDDLE'|'JUSTIFYBOTTOM'
}