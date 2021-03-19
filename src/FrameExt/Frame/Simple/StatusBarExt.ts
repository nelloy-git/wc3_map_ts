import * as Fdf from '../../../Fdf'
import { Color } from '../../../Utils'

import { SimpleStatusBar } from "./StatusBar";
import { SimpleTexture } from './Texture';
import { SimpleString } from './String';

export class SimpleStatusBarExt extends SimpleStatusBar {

    static fromFdf(): SimpleStatusBarExt
    static fromFdf(fdf: Fdf.SimpleStatusBar, background_name: string,
                   border_name: string, text_name: string): SimpleStatusBarExt
    static fromFdf(fdf?: Fdf.SimpleStatusBar, background_name?: string,
                    border_name?: string, text_name?: string){
        fdf = fdf ? fdf : DefaultFdf
        let [handle, _] = SimpleStatusBar._fromFdf(fdf)
        
        background_name = background_name ? background_name : DefaultName + 'BACKGROUND'
        let background = new SimpleTexture(BlzGetFrameByName(background_name, 0))

        border_name = border_name ? border_name : DefaultName + 'BORDER'
        let border = new SimpleTexture(BlzGetFrameByName(border_name, 0))

        text_name = text_name ? text_name : DefaultName + 'TEXT'
        let text = new SimpleString(BlzGetFrameByName(text_name, 0))
        
        return new SimpleStatusBarExt(handle, background, border, text)
    }

    constructor(handle: jframehandle, background: SimpleTexture,
                border: SimpleTexture, text: SimpleString){
        super(handle)

        this._elements = new Map()
        if (background){this._elements.set('BACKGROUND', background)}
        if (border){this._elements.set('BORDER', border)}
        if (text){this._elements.set('TEXT', text)}
    }

    getElement(elem: 'BACKGROUND' | 'BORDER'): SimpleTexture | undefined
    getElement(elem: 'TEXT'): SimpleString | undefined
    getElement(elem: SimpleStatusBar.Element){
        return this._elements.get(elem)
    }

    private _elements: Map<SimpleStatusBar.Element, SimpleTexture | SimpleString>;
}

export namespace SimpleStatusBar {
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