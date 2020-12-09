import { Log } from '../../../Utils'
import { Frame } from "../../Frame";

export type VertAlignment = 'TOP'|'MID'|'BOT'
export type HorzAlignment = 'LEFT'|'CENTER'|'RIGHT'

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

    get textVertAlignment(): VertAlignment{
        switch (this._ver_align){
            case TEXT_JUSTIFY_TOP: {return 'TOP'}
            case TEXT_JUSTIFY_MIDDLE: {return 'MID'}
            case TEXT_JUSTIFY_BOTTOM: {return 'BOT'}
            default: {return 'MID'}
        }
    }
    set textVertAlignment(align: VertAlignment){
        switch (align){
            case 'TOP': {this._ver_align = TEXT_JUSTIFY_TOP}
            case 'MID': {this._ver_align = TEXT_JUSTIFY_MIDDLE}
            case 'BOT': {this._ver_align = TEXT_JUSTIFY_BOTTOM}
        }
        BlzFrameSetTextAlignment(this.handle, this._ver_align, this._hor_align)
    }

    get textHorzAlignment(): HorzAlignment{
        switch (this._hor_align){
            case TEXT_JUSTIFY_LEFT: {return 'LEFT'}
            case TEXT_JUSTIFY_CENTER: {return 'CENTER'}
            case TEXT_JUSTIFY_RIGHT: {return 'RIGHT'}
            default: {return 'CENTER'}
        }
    }
    set textHorzAlignment(align: HorzAlignment){
        switch (align){
            case 'LEFT': {this._hor_align = TEXT_JUSTIFY_LEFT}
            case 'CENTER': {this._hor_align = TEXT_JUSTIFY_CENTER}
            case 'RIGHT': {this._hor_align = TEXT_JUSTIFY_RIGHT}
        }
        BlzFrameSetTextAlignment(this.handle, this._ver_align, this._hor_align)
    }

    addAction(){
        return Log.err(SimpleString.name + 
                       ': events are not available.')
    }
    removeAction(){
        return Log.err(SimpleString.name + 
                       ': events are not available.')
    }

    private _text: string = '';
    private _font: string = '';
    private _font_size: number = 0.08;
    private _font_flags: number = 0;
    private _ver_align: jtextaligntype = TEXT_JUSTIFY_MIDDLE;
    private _hor_align: jtextaligntype = TEXT_JUSTIFY_CENTER;
}