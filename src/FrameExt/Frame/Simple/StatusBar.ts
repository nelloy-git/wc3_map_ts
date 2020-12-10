import { Color, Log } from '../../../Utils'
import { FdfSimpleLayer } from '../../Fdf/Simple/Layer';
import { FdfSimpleTexture } from '../../Fdf/Simple/Texture';
import { FdfSimpleStatusBar } from '../../Fdf/Simple/StatusBar';
import { Frame } from "../../Frame";
import { SimpleTexture } from './Texture';
import { FdfSimpleFrame } from '../../Fdf/Simple/Frame';
import { FdfSimpleString } from '../../Fdf/Simple/String';
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

            let h_background = BlzGetFrameByName(fdf.name + 'Background', 0)
            background = new SimpleTexture(h_background)

            let h_border = BlzGetFrameByName(fdf.name + 'Border', 0)
            border = new SimpleTexture(h_border)

            let h_text = BlzGetFrameByName(fdf.name + 'Text', 0)
            text = new SimpleString(h_text)
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

    getElement(elem: 'BACKGROUND'): SimpleTexture | undefined
    getElement(elem: 'BORDER'): SimpleTexture | undefined
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

    private static _default_fdf = (()=>{
        let name = SimpleStatusBar.name + 'DefaultFdf'

        let fdf = new FdfSimpleStatusBar(name)
        fdf.width = 0.04
        fdf.height = 0.01
        fdf.barTexture = 'Replaceabletextures\\Teamcolor\\Teamcolor00.blp'
            let layer_back = new FdfSimpleLayer('BACKGROUND')
                let background = new FdfSimpleTexture(name + 'Background')
                background.textureFile = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'
            layer_back.addSubframe(background)
        fdf.addSubframe(layer_back)

            let forw_frame = new FdfSimpleFrame(name + 'Forward')
            forw_frame.setAllPoints = true
                let forw_layer = new FdfSimpleLayer('ARTWORK')
                    let forw_string = new FdfSimpleString(name + 'Text')
                    forw_string.text = 'SomeText'
                    forw_string.font = 'fonts\\nim_____.ttf'
                    forw_string.fontSize = 0.008
                    forw_string.color = new Color(1, 1, 1, 1)
                forw_layer.addSubframe(forw_string)
                    let forw_border = new FdfSimpleTexture(name + 'Border')
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