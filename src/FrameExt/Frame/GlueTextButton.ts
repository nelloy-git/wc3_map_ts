import * as Fdf from '../../Fdf'
import { Log } from "../../Utils";

import { FrameActive } from "../FrameActive";
import { Backdrop } from './Backdrop'
import { Highlight } from './Highlight'
import { Text } from './Text'

export class GlueTextButton extends FrameActive {

    static fromFdf(fdf?: Fdf.GlueTextButton){
        fdf = fdf ? fdf : DefaultFdf
        let [handle, _] = FrameActive._fromFdf(fdf)
        let f = new GlueTextButton(handle)
        f.__linkElement(fdf, 'NORMAL')
        f.__linkElement(fdf, 'PUSHED')
        f.__linkElement(fdf, 'DISABLED')
        f.__linkElement(fdf, 'MOUSE')
        f.__linkElement(fdf, 'FOCUS')
        f.__linkElement(fdf, 'TEXT')
        
        return f
    }

    constructor(handle: jframehandle,
                normal?: Backdrop, pushed?: Backdrop, disabled?: Backdrop,
                mouse?: Highlight, focus?: Highlight, text?: Text){

        super(handle, false, GlueTextButton.Events)

        this.__elements = new Map()
        if (normal){this.__elements.set('NORMAL', normal)}
        if (pushed){this.__elements.set('PUSHED', pushed)}
        if (disabled){this.__elements.set('DISABLED', disabled)}
        if (mouse){this.__elements.set('MOUSE', mouse)}
        if (focus){this.__elements.set('FOCUS', focus)}
        if (text){this.__elements.set('TEXT', text)}
    }

    public getElement(elem: 'NORMAL' | 'PUSHED' | 'DISABLED'): Backdrop | undefined
    public getElement(elem: 'MOUSE' | 'FOCUS'): Highlight | undefined
    public getElement(elem: 'TEXT'): Text | undefined
    public getElement(elem: GlueTextButton.Element){
        return this.__elements.get(elem)
    }

    private __elements: Map<GlueTextButton.Element, Backdrop | Highlight | Text>

    private __linkElement(fdf: Fdf.GlueTextButton,
                          name: Fdf.GlueTextButton.Element){
        let fdf_elem = fdf.getElement(name)
        if (!fdf_elem){return}

        let elem
        let handle = BlzGetFrameByName(fdf_elem.name, 0)
        if (name == 'NORMAL' || name == 'PUSHED' || name == 'DISABLED'){
            elem = new Backdrop(handle)
        } else if (name == 'MOUSE' || name == 'FOCUS') {
            elem = new Highlight(handle)
        } else { // (name == 'TEXT') 
            elem = new Text(handle)
        }

        this.__elements.set(name, elem)
    }
}

export namespace GlueTextButton {
    export type Element = Fdf.GlueTextButton.Element

    export const Events: ReadonlyArray<jframeeventtype> = [
        FRAMEEVENT_CONTROL_CLICK,
        FRAMEEVENT_MOUSE_DOWN,
        FRAMEEVENT_MOUSE_UP,
        FRAMEEVENT_MOUSE_ENTER,
        FRAMEEVENT_MOUSE_LEAVE,
        FRAMEEVENT_MOUSE_WHEEL,
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