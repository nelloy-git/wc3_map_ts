import { Log } from '../../../Utils'
import { Frame } from "../../Frame";

export class SimpleString extends Frame {
    constructor(handle: jframehandle){
        super(handle, true)
        this._text = ''
        this._font = ''
        this._font_size = 0.01
        this._font_flags = 0
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

    set textAlignment(a: number){BlzFrameSetTextAlignment(this.handle, TEXT_ALI)}

    addAction(){
        return Log.err(SimpleString.name + 
                       ': events are not available.')
    }
    removeAction(){
        return Log.err(SimpleString.name + 
                       ': events are not available.')
    }

    private _text: string;
    private _font: string;
    private _font_size: number;
    private _font_flags: number;
}