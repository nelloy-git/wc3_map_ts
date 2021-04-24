import { Color } from "../../Utils";
import { Fdf } from "../Fdf";

export class Text extends Fdf {
    constructor(name: string){
        super(name, 'TEXT', false)

        this.__width = -1
        this.__height = -1
        this.__decorate = false
        this.__text = ''
        this.__font = ''
        this.__font_size = 0.01
        this.__just_horz = 'JUSTIFYCENTER'
        this.__just_vert = 'JUSTIFYMIDDLE'
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

    get text(){return this.__text}
    set text(text: string){
        this._setParam('Text',  '\"' + text + '\"')
        this.__text = text
    }

    get font(){return this.__font}
    set font(path: string){
        this.__font = path
        this._setParam('FrameFont',
                       string.format('\"%s\", %f, \"\"', this.__font, this.__font_size))
    }

    get fontSize(){return this.__font_size}
    set fontSize(size: number){
        this.__font_size = size
        this._setParam('FrameFont',
                       string.format('\"%s\", %f, \"\"', this.__font, this.__font_size))
    }

    get justification(){return [this.__just_horz, this.__just_vert]}
    set justification(val: [FdfText.JustificationHorz, FdfText.JustificationVert]){
        this.__just_horz = val[0]
        this.__just_vert = val[1]
        
        this._setParam('FontJustificationH', this.__just_horz)
        this._setParam('FontJustificationV', this.__just_vert)
    }

    private __width: number 
    private __height: number
    private __decorate: boolean
    private __text: string
    private __font: string
    private __font_size: number
    private __just_horz: FdfText.JustificationHorz
    private __just_vert: FdfText.JustificationVert

    // TODO
    private __just_offset: [number, number] = [0, 0]
    private __color: Color = new Color()
    private __color_highlight: Color = new Color()
    private __color_disabled: Color = new Color()
    private __color_shadow: Color = new Color()
    private __shadow_offset: [number, number] = [0, 0]
}

export namespace FdfText {
    export type JustificationHorz = 'JUSTIFYLEFT'|'JUSTIFYCENTER'|'JUSTIFYRIGHT'
    export type JustificationVert = 'JUSTIFYTOP'|'JUSTIFYMIDDLE'|'JUSTIFYBOTTOM'
}