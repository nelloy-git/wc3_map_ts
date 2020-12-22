import * as Fdf from '../../../Fdf'
import { Color, Log } from '../../../Utils'
import { Frame } from "../../Frame";
import { SimpleTexture } from './Texture';
import { SimpleString } from './String';

export class SimpleStatusBar extends Frame {
    constructor()
    constructor(handle: jframehandle, background: SimpleTexture,
                border: SimpleTexture, text: SimpleString)
    constructor(handle?: jframehandle, background?: SimpleTexture,
                border?: SimpleTexture, text?: SimpleString){
        if (!handle){
            super(SimpleStatusBar._default_fdf)

            let fdf = SimpleStatusBar._default_fdf
            this._texture = fdf.barTexture

            background = SimpleStatusBar._newElement('BACKGROUND')
            border = SimpleStatusBar._newElement('BORDER')
            text = SimpleStatusBar._newElement('TEXT')
        } else {
            super(handle, true)
            this._texture = ''
        }

        this._fullness = 0
        this._texture_flags = 0
        this._texture_blend = true
        this._elements = new Map()
        if (background){this._elements.set('BACKGROUND', background)}
        if (border){this._elements.set('BORDER', border)}
        if (text){this._elements.set('TEXT', text)}
    }

    get texture(){return this._texture}
    set texture(path: string){
        this._texture = path
        BlzFrameSetTexture(this.handle, this._texture, this._texture_flags, this._texture_blend)
    }

    get textureFlags(){return this._texture_flags}
    set textureFlags(flags: number){
        this._texture_flags = flags
        BlzFrameSetTexture(this.handle, this._texture, this._texture_flags, this._texture_blend)
    }

    get textureBlend(){return this._texture_blend}
    set textureBlend(flag: boolean){
        this._texture_blend = flag
        BlzFrameSetTexture(this.handle, this._texture, this._texture_flags, this._texture_blend)
    }

    get fullness(){return this._fullness}
    set fullness(fullness: number){
        this._fullness = fullness < 0 ? 0 : fullness > 1 ? 1 : fullness
        BlzFrameSetValue(this.handle, 100 * this._fullness)
    }

    getElement(elem: 'BACKGROUND' | 'BORDER'): SimpleTexture | undefined
    getElement(elem: 'TEXT'): SimpleString | undefined
    getElement(elem: SimpleStatusBar.Element){
        return this._elements.get(elem)
    }

    addAction(){
        return Log.err(SimpleStatusBar.name + 
                       ': events are not available.')
    }
    removeAction(){
        return Log.err(SimpleStatusBar.name + 
                       ': events are not available.')
    }

    private _texture: string;
    private _texture_flags: number;
    private _texture_blend: boolean;
    private _fullness: number;
    private _elements: Map<SimpleStatusBar.Element, SimpleTexture | SimpleString>;

    private static _newElement(elem: 'BACKGROUND' | 'BORDER'): SimpleTexture
    private static _newElement(elem: 'TEXT'): SimpleString
    private static _newElement(elem: SimpleStatusBar.Element){
        let name = SimpleStatusBar._default_fdf.name + elem
        let handle = BlzGetFrameByName(name, 0)
        if (elem == 'BACKGROUND' || elem == 'BORDER'){
            return new SimpleTexture(handle)
        } else if (elem == 'TEXT'){
            return new SimpleString(handle)
        }
    }

    private static _default_fdf = (()=>{
        let name = SimpleStatusBar.name + 'DefaultFdf'

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