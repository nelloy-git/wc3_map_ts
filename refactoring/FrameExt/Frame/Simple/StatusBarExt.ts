import * as Fdf from '../../../Fdf'
import { Color } from '../../../../src/Utils'

import { SimpleStatusBar } from "./StatusBar";
import { SimpleTexture } from './Texture';
import { SimpleString } from './String';

export class SimpleStatusBarExt extends SimpleStatusBar {

    constructor()
    constructor(fdf: Fdf.SimpleStatusBar,
                background_name: string, border_name: string, text_name: string)
    constructor(handle: jframehandle,
                background_name: string, border_name: string, text_name: string)
    constructor(handle_or_fdf?: jframehandle | Fdf.SimpleStatusBar,
                background_name?: string, border_name?: string, text_name?: string){

        handle_or_fdf = handle_or_fdf ? handle_or_fdf : DefaultFdf
        super(handle_or_fdf)

        background_name = background_name ? background_name : DefaultName + 'BACKGROUND'
        border_name = border_name ? border_name : DefaultName + 'BORDER'
        text_name = text_name ? text_name : DefaultName + 'TEXT'

        this.__elements = new Map()
        this.__linkElement('BACKGROUND', background_name)
        this.__linkElement('BORDER', border_name)
        this.__linkElement('TEXT', text_name)
    }

    getElement(elem: 'BACKGROUND' | 'BORDER'): SimpleTexture | undefined
    getElement(elem: 'TEXT'): SimpleString | undefined
    getElement(elem: SimpleStatusBarExt.Element){
        return this.__elements.get(elem)
    }

    private __linkElement(elem: SimpleStatusBarExt.Element, name?: string){
        if (!name){ return}

        let handle = BlzGetFrameByName(name, 0)
        let frame: SimpleTexture | SimpleString
        if (elem == 'BACKGROUND' || elem == 'BORDER'){
            frame = new SimpleTexture(handle)
        } else {    //elem == 'TEXT'
            frame = new SimpleString(handle)
        }

        this.__elements.set(elem, frame)
    }

    private __elements: Map<SimpleStatusBarExt.Element, SimpleTexture | SimpleString>;
}

export namespace SimpleStatusBarExt {
    export type Element = 'BACKGROUND' | 'BORDER' | 'TEXT'
}

let DefaultName = SimpleStatusBarExt.name + 'DefaultFdf'
let DefaultFdf = new Fdf.SimpleStatusBar(DefaultName)
DefaultFdf.width = 0.04
DefaultFdf.height = 0.01
DefaultFdf.barTexture = 'Replaceabletextures\\Teamcolor\\Teamcolor00.blp'
{
    let layer_back = new Fdf.SimpleLayer('BACKGROUND')
    {
        let background = new Fdf.SimpleTexture(DefaultName + 'BACKGROUND')
        background.textureFile = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'
        layer_back.addSubframe(background)
    }
    DefaultFdf.addSubframe(layer_back)
    
    let forw_frame = new Fdf.SimpleFrame(DefaultName + 'Forward')
    forw_frame.setAllPoints = true
    {
        let forw_layer = new Fdf.SimpleLayer('ARTWORK')
        {
            let forw_string = new Fdf.SimpleString(DefaultName + 'TEXT')
            forw_string.text = 'SomeText'
            forw_string.font = 'fonts\\nim_____.ttf'
            forw_string.fontSize = 0.008
            forw_string.color = new Color(1, 1, 1, 1)
            forw_layer.addSubframe(forw_string)
        }

        {
            let forw_border = new Fdf.SimpleTexture(DefaultName + 'BORDER')
            forw_border.textureFile = 'UI\\Feedback\\XPBar\\human-xpbar-border.blp'
            forw_layer.addSubframe(forw_border)
        }
        forw_frame.addSubframe(forw_layer)
    }
    DefaultFdf.addSubframe(forw_frame)        
}