import { Color } from "../../Utils";
import { Fdf } from "../Fdf";

type TextJustificationHorz = 'JUSTIFYLEFT'|'JUSTIFYCENTER'|'JUSTIFYRIGHT'
type TextJustificationVert = 'JUSTIFYTOP'|'JUSTIFYMIDDLE'|'JUSTIFYBOTTOM'

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
        this._setParam('Text', text)
        this._text = text
    }

    private _width: number = -1;
    private _height: number = -1;
    private _decorate: boolean = false;
    private _text: string = ''
    // TODO
    private _font: string = ''
    private _just_horz: TextJustificationHorz = 'JUSTIFYCENTER'
    private _just_vert: TextJustificationVert = 'JUSTIFYMIDDLE'
    private _just_offset: [number, number] = [0, 0]
    private _color: Color = new Color(1, 1, 1, 1)
    private _color_highlight: Color = new Color(1, 1, 1, 1)
    private _color_disabled: Color = new Color(1, 1, 1, 1)
    private _color_shadow: Color = new Color(1, 1, 1, 1)
    private _shadow_offset: [number, number] = [0, 0]
}