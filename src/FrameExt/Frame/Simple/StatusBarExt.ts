import * as Fdf from '../../../Fdf'
import { Color, Log } from '../../../Utils'
import { SimpleStatusBar } from "./StatusBar";
import { SimpleTexture } from './Texture';
import { SimpleString } from './String';

export class SimpleStatusBarExt extends SimpleStatusBar {
    constructor()
    constructor(handle: jframehandle, background: SimpleTexture,
                border: SimpleTexture, text: SimpleString)
    constructor(handle?: jframehandle, background?: SimpleTexture,
                border?: SimpleTexture, text?: SimpleString){
        if (!handle){
            let fdf = SimpleStatusBarExt._def_fdf

            super(fdf)
            background = SimpleStatusBarExt._captureElement('BACKGROUND')
            border = SimpleStatusBarExt._captureElement('BORDER')
            text = SimpleStatusBarExt._captureElement('TEXT')
        } else {
            super(handle)
        }

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

    private static _captureElement(elem: 'BACKGROUND' | 'BORDER'): SimpleTexture
    private static _captureElement(elem: 'TEXT'): SimpleString
    private static _captureElement(elem: SimpleStatusBar.Element){
        let name = SimpleStatusBarExt._def_fdf.name + elem
        let handle = BlzGetFrameByName(name, 0)
        if (elem == 'BACKGROUND' || elem == 'BORDER'){
            return new SimpleTexture(handle)
        } else if (elem == 'TEXT'){
            return new SimpleString(handle)
        }
    }

    private static _def_fdf = (()=>{
        let name = SimpleStatusBarExt.name + 'DefaultFdf'

        let fdf = new Fdf.SimpleStatusBar(name)
        fdf.width = 0.04
        fdf.height = 0.01
        fdf.barTexture = 'Replaceabletextures\\Teamcolor\\Teamcolor00.blp'
            let layer_back = new Fdf.SimpleLayer('BACKGROUND')
                let background = new Fdf.SimpleTexture(name + 'BACKGROUND')
                background.textureFile = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'
            layer_back.addSubframe(background)
        fdf.addSubframe(layer_back)

            let forw_frame = new Fdf.SimpleFrame(name + 'Forward')
            forw_frame.setAllPoints = true
                let forw_layer = new Fdf.SimpleLayer('ARTWORK')
                    let forw_string = new Fdf.SimpleString(name + 'TEXT')
                    forw_string.text = 'SomeText'
                    forw_string.font = 'fonts\\nim_____.ttf'
                    forw_string.fontSize = 0.008
                    forw_string.color = new Color(1, 1, 1, 1)
                forw_layer.addSubframe(forw_string)
                    let forw_border = new Fdf.SimpleTexture(name + 'BORDER')
                    forw_border.textureFile = 'UI\\Feedback\\XPBar\\human-xpbar-border.blp'
                forw_layer.addSubframe(forw_border)
            forw_frame.addSubframe(forw_layer)
        fdf.addSubframe(forw_frame)

        return fdf
    })()
}

export namespace SimpleStatusBar {
    export type Element = 'BACKGROUND' | 'BORDER' | 'TEXT'
}