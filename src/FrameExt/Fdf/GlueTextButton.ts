import { Fdf } from "../Fdf";

import { FdfBackdrop } from './Backdrop'
import { FdfHighlight } from './Highlight'
import { Text } from './Text'

export type Element = 'NORMAL'|'PUSHED'|'DISABLED'|'MOUSE'|'FOCUS'|'TEXT'

export class FdfGlueTextButton extends Fdf {
    constructor(name: string){
        super(name, 'GLUETEXTBUTTON', false)
        this._setParam('ControlStyle', 'AUTOTRACK|HIGHLIGHTONFOCUS|HIGHLIGHTONMOUSEOVER')
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

    public hasElement(elem: Element){
        if (this._elements.get(elem)){return true}
        return false
    }

    public getElement(elem: Element){
        let res = this._elements.get(elem)
        if (res){return res}
    }

    /** Create element if it does not exist. */
    public getOrNewElement(elem: Element){
        let res = this._elements.get(elem)
        if (res){return res}

        if (elem == 'NORMAL' || elem == 'PUSHED' || elem == 'DISABLED'){
            res = new FdfBackdrop(this.name + elem)
        } else if (elem == 'MOUSE' || elem == 'FOCUS') {
            res = new FdfHighlight(this.name + elem)
        } else {
            res = new Text(this.name + elem)
        }
        this._elements.set(elem, res)
        return res
    }
    
    private _width: number = -1;
    private _height: number = -1;
    private _decorate: boolean = false;
    private _text_offset: [number, number] = [0, 0]
    private _elements = new Map<Element, FdfBackdrop | FdfHighlight | Text>()
}