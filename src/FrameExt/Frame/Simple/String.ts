import { Log } from '../../../Utils'
import { Frame } from "../../Frame"

export class SimpleString extends Frame {
    constructor(handle: jframehandle){
        super(handle, true)

        this.font = this.font
    }

    get text(){return this._text}
    set text(text: string){
        this._text = text
        BlzFrameSetText(this.handle, text)
    }

    get font(){return this._font}
    set font(path: string){
        this._font = path
        BlzFrameSetFont(this.handle, this._font, this._font_size, this._font_flags)
    }

    get fontSize(){return this._font_size}
    set fontSize(size: number){
        this._font_size = size
        BlzFrameSetFont(this.handle, this._font, this._font_size, this._font_flags)
    }

    get fontFlags(){return this._font_flags}
    set fontFlags(flags: number){
        this._font_flags = flags
        BlzFrameSetFont(this.handle, this._font, this._font_size, this._font_flags)
    }

    private _text: string = '';
    private _font: string = 'fonts\\nim_____.ttf';
    private _font_size: number = 0.008;
    private _font_flags: number = 0;
}