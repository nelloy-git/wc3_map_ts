import { Log } from "../../Utils";

import { Backdrop } from './Backdrop'
import { Highlight } from './Highlight'
import { Text } from './Text'

import { FdfBackdrop } from '../Fdf/Backdrop'
import { FdfHighlight } from '../Fdf/Highlight'
import { FdfGlueTextButton, Element} from '../Fdf/GlueTextButton'
import { Frame } from "../Frame";

export {Element}

export class GlueTextButton extends Frame {
    constructor()
    constructor(fdf: FdfGlueTextButton)
    constructor(handle: jframehandle,
                normal: Backdrop, pushed?: Backdrop, disable?: Backdrop,
                mouse?: Highlight, focus?: Highlight, text?: Text)
    constructor(handle?: FdfGlueTextButton|jframehandle,
                normal?: Backdrop, pushed?: Backdrop, disabled?: Backdrop,
                mouse?: Highlight, focus?: Highlight, text?: Text){

        if (!handle){handle = GlueTextButton._default_fdf}
        if (handle instanceof FdfGlueTextButton){
            let fdf = handle

            super(fdf)
            normal = GlueTextButton.getElementIfExist(fdf, 'NORMAL') as Backdrop
            pushed = GlueTextButton.getElementIfExist(fdf, 'PUSHED') as Backdrop
            disabled = GlueTextButton.getElementIfExist(fdf, 'DISABLED') as Backdrop
            mouse = GlueTextButton.getElementIfExist(fdf, 'MOUSE') as Highlight
            focus = GlueTextButton.getElementIfExist(fdf, 'FOCUS') as Highlight
            text = GlueTextButton.getElementIfExist(fdf, 'TEXT') as Text
        } else {
            super(handle, false)
        }

        this._elements = new Map()
        if (normal){this._elements.set('NORMAL', normal)}
        if (pushed){this._elements.set('PUSHED', pushed)}
        if (disabled){this._elements.set('DISABLED', disabled)}
        if (mouse){this._elements.set('MOUSE', mouse)}
        if (focus){this._elements.set('FOCUS', focus)}
        if (text){this._elements.set('TEXT', text)}
    }

    public getElement(elem: Element){
        return this._elements.get(elem)
    }

    private _elements: Map<Element, Backdrop | Highlight | Text>

    private static getElementIfExist(fdf: FdfGlueTextButton, elem: Element){
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
        let fdf = new FdfGlueTextButton(GlueTextButton.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04

        let normal = <FdfBackdrop>fdf.getOrNewElement('NORMAL')
        normal.background = 'Replaceabletextures\\Teamcolor\\Teamcolor00.blp'

        let pushed = <FdfBackdrop>fdf.getOrNewElement('PUSHED')
        pushed.background = 'Replaceabletextures\\Teamcolor\\Teamcolor01.blp'

        let disabled = <FdfBackdrop>fdf.getOrNewElement('DISABLED')
        disabled.background = 'Replaceabletextures\\Teamcolor\\Teamcolor02.blp'

        let mouse = <FdfHighlight>fdf.getOrNewElement('MOUSE')
        mouse.highlightType = 'FILETEXTURE'
        mouse.alphaFile = 'UI\\Glues\\ScoreScreen\\scorescreen-tab-hilight.blp'
        mouse.alphaMode = 'ADD'

        return fdf
    })()
}