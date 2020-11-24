import { Color } from "../../Utils";
import { Fdf } from "../Fdf";

type HighlightType = 'FILETEXTURE' | 'SHADE'
type HighlightMode = 'ADD' | 'BLEND'

export class FdfHighlight extends Fdf {
    constructor(name: string){
        super(name, 'HIGHLIGHT', false)
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

    public get highlightType(){return this._highlight_type}
    public set highlightType(type: HighlightType){
        this._setParam('HighlightType', type)
        this._highlight_type = type
    }

    public get alphaFile(){return this._alpha_path}
    public set alphaFile(path: string){
        this._setParam('HighlightAlphaFile', path)
        this._alpha_path = path
    }

    public get alphaMode(){return this._alpha_mode}
    public set alphaMode(mode: HighlightMode){
        this._setParam('HighlightAlphaMode', mode)
        this._alpha_mode = mode
    }

    public get color(){return new Color(this._color)}
    public set color(c: Color){
        this._setParam('HighlightColor', string.format('%f %f %f %f', c.r, c.g, c.b, c.a))
        this._color = new Color(c)
    }

    private _width: number = -1;
    private _height: number = -1;
    private _decorate: boolean = false;
    private _highlight_type: HighlightType = 'SHADE';
    private _alpha_path: string = ''
    private _alpha_mode: HighlightMode = 'ADD'
    private _color: Color = new Color(1, 1, 1, 1)
}