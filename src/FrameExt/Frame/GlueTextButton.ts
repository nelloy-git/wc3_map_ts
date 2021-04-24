import * as Fdf from '../../Fdf'

import { FrameActive } from "../FrameActive";
import { Backdrop } from './Backdrop'
import { Highlight } from './Highlight'
import { Text } from './Text'

export class GlueTextButton extends FrameActive {

    constructor()
    constructor(fdf: Fdf.GlueTextButton)
    constructor(handle: jframehandle,
                normal_name: string, pushed_name: string, disabled_name: string,
                mouse_name: string, focus_name: string, text_name: string)
    constructor(handle_or_fdf?: jframehandle | Fdf.GlueTextButton,
                normal_name?: string, pushed_name?: string, disabled_name?: string,
                mouse_name?: string, focus_name?: string, text_name?: string){

        handle_or_fdf = handle_or_fdf ? handle_or_fdf : DefaultFdf
        super(handle_or_fdf, false, GlueTextButton.Events)
        
        if (handle_or_fdf instanceof Fdf.GlueTextButton){
            normal_name = GlueTextButton.__linkedElementName(handle_or_fdf, 'NORMAL')
            pushed_name = GlueTextButton.__linkedElementName(handle_or_fdf, 'PUSHED')
            disabled_name = GlueTextButton.__linkedElementName(handle_or_fdf, 'DISABLED')
            mouse_name = GlueTextButton.__linkedElementName(handle_or_fdf, 'MOUSE')
            focus_name = GlueTextButton.__linkedElementName(handle_or_fdf, 'FOCUS')
            text_name = GlueTextButton.__linkedElementName(handle_or_fdf, 'TEXT')
        }

        this.__elements = new Map()
        this.__linkElement('NORMAL', normal_name)
        this.__linkElement('PUSHED', pushed_name)
        this.__linkElement('DISABLED', disabled_name)
        this.__linkElement('MOUSE', mouse_name)
        this.__linkElement('FOCUS', focus_name)
        this.__linkElement('TEXT', text_name)
    }

    getElement(elem: 'NORMAL' | 'PUSHED' | 'DISABLED'): Backdrop | undefined
    getElement(elem: 'MOUSE' | 'FOCUS'): Highlight | undefined
    getElement(elem: 'TEXT'): Text | undefined
    getElement(elem: GlueTextButton.Element){
        return this.__elements.get(elem)
    }

    private __linkElement(elem: GlueTextButton.Element, name?: string){
        if (!name){ return}

        let handle = BlzGetFrameByName(name, 0)
        let frame: Backdrop | Highlight | Text
        if (elem == 'NORMAL' || elem == 'PUSHED' || elem == 'DISABLED'){
            frame = new Backdrop(handle)
        } else if (elem == 'FOCUS' || elem == 'MOUSE'){
            frame = new Highlight(handle)
        } else { // elem == 'TEXT'
            frame = new Text(handle)
        }

        this.__elements.set(elem, frame)
    }

    private __elements: Map<GlueTextButton.Element, Backdrop | Highlight | Text>

    private static __linkedElementName(fdf: Fdf.GlueTextButton,
                                       elem: Fdf.GlueTextButton.Element){
        let fdf_elem = fdf.getElement(elem)
        return fdf_elem ? fdf_elem.name : undefined
    }
}

export namespace GlueTextButton {
    export type Element = Fdf.GlueTextButton.Element

    export const Events: ReadonlyArray<FrameActive.Event> = [
        'CONTROL_CLICK',
        'MOUSE_DOWN',
        'MOUSE_UP',
        'MOUSE_ENTER',
        'MOUSE_LEAVE',
        'MOUSE_WHEEL',
    ]
}

const DefaultFdf = new Fdf.GlueTextButton(GlueTextButton.name + 'DefaultFdf')
DefaultFdf.width = 0.04
DefaultFdf.height = 0.04
{
    let normal = DefaultFdf.newElement('NORMAL')
    normal.background = 'Replaceabletextures\\Teamcolor\\Teamcolor00.blp'

    let pushed = DefaultFdf.newElement('PUSHED')
    pushed.background = 'Replaceabletextures\\Teamcolor\\Teamcolor01.blp'

    let disabled = DefaultFdf.newElement('DISABLED')
    disabled.background = 'Replaceabletextures\\Teamcolor\\Teamcolor02.blp'

    let mouse = DefaultFdf.newElement('MOUSE')
    mouse.highlightType = 'FILETEXTURE'
    mouse.alphaFile = 'UI\\Glues\\ScoreScreen\\scorescreen-tab-hilight.blp'
    mouse.alphaMode = 'ADD'
}