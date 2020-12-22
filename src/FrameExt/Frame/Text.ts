import * as Fdf from '../../Fdf'
import { Log } from "../../Utils";
import { Frame } from "../Frame";

export type VertAlignment = 'TOP'|'MID'|'BOT'
export type HorzAlignment = 'LEFT'|'CENTER'|'RIGHT'

export class Text extends Frame {
    constructor()
    constructor(fdf: Fdf.Text)
    constructor(handle: jframehandle)
    constructor(handle?: Fdf.Text | jframehandle){
        if (!handle){handle = Text._default_fdf}

        if (handle instanceof Fdf.Text){
            super(handle)
            this._text = handle.text
        } else {
            super(handle, false)
            this._text = ''
        }
        
        this._ver_align = TEXT_JUSTIFY_MIDDLE
        this._hor_align = TEXT_JUSTIFY_CENTER
    }

    public get text(){return this._text}
    public set text(text: string){
        this._text = text
        BlzFrameSetText(this.handle, text)
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

    public addAction(){
        return Log.err(Text.name + 
                       ': events are not available.')
    }
    public removeAction(){
        return Log.err(Text.name + 
                       ': events are not available.')
    }

    private _text: string;
    private _ver_align: jtextaligntype;
    private _hor_align: jtextaligntype;

    private static _default_fdf = (()=>{
        let fdf = new Fdf.Text(Text.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04
        fdf.font = 'fonts\\nim_____.ttf'
        fdf.fontSize = 0.008
        fdf.justification = ['JUSTIFYCENTER', 'JUSTIFYMIDDLE']
        return fdf
    })()
}