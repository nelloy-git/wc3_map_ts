import { Fdf } from "../Fdf";

import { FdfBackdrop } from './Backdrop'
import { FdfHighlight } from './Highlight'
import { FdfText } from './Text'

export class FdfGlueTextButton extends Fdf {
    constructor(name: string){
        super(name, 'GLUETEXTBUTTON', false)
        this._setParam('ControlStyle', '\"AUTOTRACK\"')
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

    public get pushedTextOffset(){return this._text_offset}
    public set pushedTextOffset(offset: [x: number, y: number]){
        let [x, y] = offset
        this._setParam('ButtonPushedTextOffset', x.toString() + ' ' + y.toString())
        this._text_offset = offset
    }

    public hasElement(elem: FdfGlueTextButton.Element){
        if (this._elements.get(elem)){return true}
        return false
    }

    public getElement(elem: FdfGlueTextButton.Element){
        let res = this._elements.get(elem)
        if (res){return res}
    }

    /** Create element if it does not exist. */
    public getOrNewElement(elem: FdfGlueTextButton.Element){
        let res = this._elements.get(elem)
        if (res){return res}

        if (elem == 'NORMAL' || elem == 'PUSHED' || elem == 'DISABLED'){
            res = new FdfBackdrop(this.name + elem)
        } else if (elem == 'MOUSE' || elem == 'FOCUS') {
            res = new FdfHighlight(this.name + elem)
        } else {
            res = new FdfText(this.name + elem)
        }
        this._applyElement(elem, res)
        return res
    }

    private _applyElement(elem: FdfGlueTextButton.Element, sub: FdfBackdrop | FdfHighlight | FdfText){
        let param = FdfGlueTextButton._elem2param.get(elem) as string
        this._setParam(param, '\"' + this.name + elem + '\"')
        if (elem == 'MOUSE' && !this._track_mouse){
            this._track_mouse = true
            let style = this._getParam('ControlStyle') as string
            this._setParam('ControlStyle', style.slice(0, style.length - 1) + '|HIGHLIGHTONMOUSEOVER\"')
        }
        if (elem == 'FOCUS' && !this._track_focus){
            this._track_focus = true
            let style = this._getParam('ControlStyle') as string
            this._setParam('ControlStyle', style.slice(0, style.length - 1) + '|HIGHLIGHTONFOCUS\"')
        }
        this._elements.set(elem, sub)
        this.addSubframe(sub)
    }
    
    private _width: number = -1;
    private _height: number = -1;
    private _decorate: boolean = false;
    private _text_offset: [number, number] = [0, 0]

    private _track_mouse: boolean = false
    private _track_focus: boolean = false
    private _elements = new Map<FdfGlueTextButton.Element, FdfBackdrop | FdfHighlight | FdfText>()

    private static _elem2param = new Map<FdfGlueTextButton.Element, string>([
        ['NORMAL', 'ControlBackdrop'],
        ['PUSHED', 'ControlPushedBackdrop'],
        ['DISABLED', 'ControlDisabledBackdrop'],
        ['MOUSE', 'ControlMouseOverHighlight'],
        ['FOCUS', 'ControlFocusHighlight'],
        ['TEXT', 'ButtonText']
    ])
}

export namespace FdfGlueTextButton {
    export type Element = 'NORMAL'|'PUSHED'|'DISABLED'|'MOUSE'|'FOCUS'|'TEXT'
}