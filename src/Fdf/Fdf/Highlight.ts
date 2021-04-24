import { Color } from "../../Utils";
import { Fdf } from "../Fdf";

export class Highlight extends Fdf {
    constructor(name: string){
        super(name, 'HIGHLIGHT', false)
    }

    get width(){return this.__width}
    set width(w: number){
        this._setParam('Width', w.toString())
        this.__width = w
    }

    get height(){return this.__height}
    set height(h: number){
        this._setParam('Height', h.toString())
        this.__height = h
    }

    get decorateFileNames(){return this.__decorate}
    set decorateFileNames(flag: boolean){
        if (flag){
            this._setParam('DecorateFileNames')
        } else {
            this._removeParam('DecorateFileNames')
        }
        this.__decorate = flag
    }

    get highlightType(){return this.__highlight_type}
    set highlightType(type: FdfHighlight.Type){
        this._setParam('HighlightType',  '\"' + type + '\"')
        this.__highlight_type = type
    }

    get alphaFile(){return this.__alpha_path}
    set alphaFile(path: string){
        this._setParam('HighlightAlphaFile',  '\"' + path + '\"')
        this.__alpha_path = path
    }

    get alphaMode(){return this.__alpha_mode}
    set alphaMode(mode: FdfHighlight.Mode){
        this._setParam('HighlightAlphaMode', '\"' + mode + '\"')
        this.__alpha_mode = mode
    }

    get color(){return this.__color.copy()}
    set color(c: Color){
        this._setParam('HighlightColor', string.format('%f %f %f %f', c.r, c.g, c.b, c.a))
        this.__color = c.copy()
    }

    private __width: number = -1;
    private __height: number = -1;
    private __decorate: boolean = false;
    private __highlight_type: FdfHighlight.Type = 'SHADE';
    private __alpha_path: string = ''
    private __alpha_mode: FdfHighlight.Mode = 'ADD'
    private __color: Color = new Color(1, 1, 1, 1)
}

export namespace FdfHighlight {
    export type Type = 'FILETEXTURE' | 'SHADE'
    export type Mode = 'ADD' | 'BLEND'
}