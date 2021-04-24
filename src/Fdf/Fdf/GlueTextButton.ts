import { Fdf } from "../Fdf";

import { Backdrop } from './Backdrop'
import { Highlight } from './Highlight'
import { Text } from './Text'

export class GlueTextButton extends Fdf {
    constructor(name: string){
        super(name, 'GLUETEXTBUTTON', false)
        this._setParam('ControlStyle', '\"AUTOTRACK\"')
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

    get pushedTextOffset(){return this.__text_offset}
    set pushedTextOffset(offset: [x: number, y: number]){
        let [x, y] = offset
        this._setParam('ButtonPushedTextOffset', x.toString() + ' ' + y.toString())
        this.__text_offset = offset
    }

    hasElement(elem: GlueTextButton.Element){
        return this.__elements.get(elem) != undefined
    }

    getElement(elem: 'NORMAL' | 'PUSHED' | 'DISABLED'): Backdrop | undefined
    getElement(elem: 'MOUSE' | 'FOCUS'): Highlight | undefined
    getElement(elem: 'TEXT'): Text | undefined
    getElement(elem: GlueTextButton.Element): Backdrop | Highlight | Text | undefined
    getElement(elem: GlueTextButton.Element){
        let res = this.__elements.get(elem)
        if (res){return res}
    }

    newElement(elem: 'NORMAL' | 'PUSHED' | 'DISABLED'): Backdrop
    newElement(elem: 'MOUSE' | 'FOCUS'): Highlight
    newElement(elem: 'TEXT'): Text
    newElement(elem: GlueTextButton.Element){
        if (this.hasElement(elem)){
            error(this.toString() + ': element already exists', 2)
        }

        let res
        if (elem == 'NORMAL' || elem == 'PUSHED' || elem == 'DISABLED'){
            res = new Backdrop(this.name + elem)
        } else if (elem == 'MOUSE' || elem == 'FOCUS') {
            res = new Highlight(this.name + elem)
        } else {
            res = new Text(this.name + elem)
        }
        this._applyElement(elem, res)

        return res
    }

    private _applyElement(elem: GlueTextButton.Element, sub: Backdrop | Highlight | Text){
        let param = GlueTextButton.__elem2param.get(elem) as string
        this._setParam(param, '\"' + this.name + elem + '\"')
        if (elem == 'MOUSE' && !this.__track_mouse){
            this.__track_mouse = true
            let style = this._getParam('ControlStyle') as string
            this._setParam('ControlStyle', style.slice(0, style.length - 1) + '|HIGHLIGHTONMOUSEOVER\"')
        }
        if (elem == 'FOCUS' && !this.__track_focus){
            this.__track_focus = true
            let style = this._getParam('ControlStyle') as string
            this._setParam('ControlStyle', style.slice(0, style.length - 1) + '|HIGHLIGHTONFOCUS\"')
        }
        this.__elements.set(elem, sub)
        this.addSubframe(sub)
    }
    
    private __width: number = -1;
    private __height: number = -1;
    private __decorate: boolean = false;
    private __text_offset: [number, number] = [0, 0]

    private __track_mouse: boolean = false
    private __track_focus: boolean = false
    private __elements = new Map<GlueTextButton.Element, Backdrop | Highlight | Text>()

    private static __elem2param = new Map<GlueTextButton.Element, string>([
        ['NORMAL', 'ControlBackdrop'],
        ['PUSHED', 'ControlPushedBackdrop'],
        ['DISABLED', 'ControlDisabledBackdrop'],
        ['MOUSE', 'ControlMouseOverHighlight'],
        ['FOCUS', 'ControlFocusHighlight'],
        ['TEXT', 'ButtonText']
    ])
}

export namespace GlueTextButton {
    export type Element = 'NORMAL' | 'PUSHED' | 'DISABLED' | 'MOUSE' | 'FOCUS' | 'TEXT'
}