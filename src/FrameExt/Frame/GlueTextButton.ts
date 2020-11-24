import { Log } from "../../Utils";

import { Backdrop } from './Backdrop'
import { Highlight } from './Highlight'
import { Text } from './Text'

import { FdfBackdrop } from '../Fdf/Backdrop'
import { FdfHighlight } from '../Fdf/Highlight'
import { FdfGlueTextButton, Element} from '../Fdf/GlueTextButton'
import { Frame } from "../Frame";

export {Element}

function getHandleIfExist(fdf: FdfGlueTextButton, elem: Element){
    let fdf_elem = fdf.getElement(elem)
    if (!fdf_elem){return}
    return BlzGetFrameByName(fdf_elem.name, 0)
}

export class GlueTextButton extends Frame {
    constructor()
    constructor(fdf: FdfGlueTextButton)
    constructor(handle: jframehandle,
                normal: jframehandle, pushed: jframehandle, disabled: jframehandle,
                mouse: jframehandle, focus: jframehandle, text: jframehandle)
    constructor(handle?: FdfGlueTextButton|jframehandle,
                normal?: jframehandle, pushed?: jframehandle, disabled?: jframehandle,
                mouse?: jframehandle, focus?: jframehandle, text?: jframehandle){

        if (!handle){handle = GlueTextButton._default_fdf}
        if (handle instanceof FdfGlueTextButton){
            let fdf = handle

            super(fdf)
            
            normal = getHandleIfExist(fdf, 'NORMAL')
            pushed = getHandleIfExist(fdf, 'PUSHED')
            disabled = getHandleIfExist(fdf, 'DISABLED')
            mouse = getHandleIfExist(fdf, 'MOUSE')
            focus = getHandleIfExist(fdf, 'FOCUS')
            text = getHandleIfExist(fdf, 'TEXT')
        } else {
            super(handle, false)
        }

        this._elements = new Map()
        if (normal){this._elements.set('NORMAL', new Backdrop(normal))}
        if (pushed){this._elements.set('PUSHED', new Backdrop(pushed))}
        if (disabled){this._elements.set('DISABLED', new Backdrop(disabled))}
        if (mouse){this._elements.set('MOUSE', new Highlight(mouse))}
        if (focus){this._elements.set('FOCUS', new Highlight(focus))}
        if (text){this._elements.set('TEXT', new Text(text))}
    }

    public getElement(elem: Element){
        return this._elements.get(elem)
    }

    private _elements: Map<Element, Backdrop | Highlight | Text>

    private static _default_fdf = (()=>{
        let fdf = new FdfGlueTextButton(GlueTextButton.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04

        let normal = <FdfBackdrop>fdf.getOrNewElement('NORMAL')
        normal.background = ''

        let pushed = <FdfBackdrop>fdf.getOrNewElement('PUSHED')
        pushed.background = ''

        let disabled = <FdfBackdrop>fdf.getOrNewElement('DISABLED')
        disabled.background = ''

        let mouse = <FdfHighlight>fdf.getOrNewElement('MOUSE')
        mouse.highlightType = 'FILETEXTURE'
        mouse.alphaFile = 'UI\\Glues\\ScoreScreen\\scorescreen-tab-hilight.blp'
        mouse.alphaMode = 'ADD'

        let focus = <FdfHighlight>fdf.getOrNewElement('MOUSE')
        focus.highlightType = 'FILETEXTURE'
        focus.alphaFile = 'UI\\Glues\\ScoreScreen\\scorescreen-tab-hilight.blp'
        focus.alphaMode = 'ADD'

        return fdf
    })()
}