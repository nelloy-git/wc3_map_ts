import * as Fdf from '../../Fdf'
import { Log } from "../../Utils";

import { Frame } from "../FrameOld";
import { Backdrop } from './Backdrop'
import { Highlight } from './Highlight'
import { Text } from './Text'

export class GlueTextButton extends Frame {
    constructor()
    constructor(fdf: Fdf.GlueTextButton)
    constructor(handle: jframehandle,
                normal: Backdrop, pushed?: Backdrop, disable?: Backdrop,
                mouse?: Highlight, focus?: Highlight, text?: Text)
    constructor(handle?: Fdf.GlueTextButton | jframehandle,
                normal?: Backdrop, pushed?: Backdrop, disabled?: Backdrop,
                mouse?: Highlight, focus?: Highlight, text?: Text){

        if (!handle){handle = GlueTextButton._default_fdf}
        if (handle instanceof Fdf.GlueTextButton){
            let fdf = handle

            super(fdf)
            normal = GlueTextButton._newElement(fdf, 'NORMAL')
            pushed = GlueTextButton._newElement(fdf, 'PUSHED')
            disabled = GlueTextButton._newElement(fdf, 'DISABLED')
            mouse = GlueTextButton._newElement(fdf, 'MOUSE')
            focus = GlueTextButton._newElement(fdf, 'FOCUS')
            text = GlueTextButton._newElement(fdf, 'TEXT')
        } else {
            super(handle, false)
        }
        this.initEvents(['CLICK', 'DOUBLECLICK', 'DOWN', 'ENTER', 'LEAVE', 'UP', 'WHEEL'])

        this._elements = new Map()
        if (normal){this._elements.set('NORMAL', normal)}
        if (pushed){this._elements.set('PUSHED', pushed)}
        if (disabled){this._elements.set('DISABLED', disabled)}
        if (mouse){this._elements.set('MOUSE', mouse)}
        if (focus){this._elements.set('FOCUS', focus)}
        if (text){this._elements.set('TEXT', text)}
    }

    public getElement(elem: 'NORMAL' | 'PUSHED' | 'DISABLED'): Backdrop | undefined
    public getElement(elem: 'MOUSE' | 'FOCUS'): Highlight | undefined
    public getElement(elem: 'TEXT'): Text | undefined
    public getElement(elem: GlueTextButton.Element){
        return this._elements.get(elem)
    }

    private _elements: Map<GlueTextButton.Element, Backdrop | Highlight | Text>

    private static _newElement(fdf: Fdf.GlueTextButton,
                               elem: 'NORMAL' | 'PUSHED' | 'DISABLED'): Backdrop | undefined
    private static _newElement(fdf: Fdf.GlueTextButton,
                               elem: 'MOUSE' | 'FOCUS'): Highlight | undefined
    private static _newElement(fdf: Fdf.GlueTextButton,
                               elem: 'TEXT'): Text | undefined
    private static _newElement(fdf: Fdf.GlueTextButton,
                               elem: Fdf.GlueTextButton.Element){
        let fdf_elem = fdf.getElement(elem)
        if (!fdf_elem){return}

        let handle = BlzGetFrameByName(fdf_elem.name, 0)
        if (elem == 'NORMAL' || elem == 'PUSHED' || elem == 'DISABLED'){
            return new Backdrop(handle)
        } else if (elem == 'MOUSE' || elem == 'FOCUS') {
            return new Highlight(handle)
        } else if (elem == 'TEXT') {
            return new Text(handle)
        }
    }

    private static _default_fdf = (()=>{
        let fdf = new Fdf.GlueTextButton(GlueTextButton.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04

        let normal = fdf.newElement('NORMAL')
        normal.background = 'Replaceabletextures\\Teamcolor\\Teamcolor00.blp'

        let pushed = fdf.newElement('PUSHED')
        pushed.background = 'Replaceabletextures\\Teamcolor\\Teamcolor01.blp'

        let disabled = fdf.newElement('DISABLED')
        disabled.background = 'Replaceabletextures\\Teamcolor\\Teamcolor02.blp'

        let mouse = fdf.newElement('MOUSE')
        mouse.highlightType = 'FILETEXTURE'
        mouse.alphaFile = 'UI\\Glues\\ScoreScreen\\scorescreen-tab-hilight.blp'
        mouse.alphaMode = 'ADD'

        return fdf
    })()
}

export namespace GlueTextButton {
    export type Element = Fdf.GlueTextButton.Element
}