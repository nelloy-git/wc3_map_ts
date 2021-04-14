import * as Fdf from '../../Fdf'

import { Frame } from "../Frame";

export class Text extends Frame {

    constructor(handle_or_fdf?: jframehandle | Fdf.Text){
        handle_or_fdf = handle_or_fdf ? handle_or_fdf : DefaultFdf
        super(handle_or_fdf, false)

        if (handle_or_fdf instanceof Fdf.Text){
            this.__text = handle_or_fdf.text
            this.__vert_align = handle_or_fdf.justification[1]
            this.__horz_align = handle_or_fdf.justification[0]
        } else {
            this.__text = ''
            this.__vert_align = 'JUSTIFYMIDDLE'
            this.__horz_align = 'JUSTIFYCENTER'
        }
    }

    public get text(){return this.__text}
    public set text(text: string){
        this.__text = text
        BlzFrameSetText(this.handle, text)
    }
    
    get textVertAlignment(): Text.VertAlignment {
        return this.__vert_align
    }
    set textVertAlignment(align: Text.VertAlignment){
        this.__vert_align = align
        this.__applyAlighment()
    }

    get textHorzAlignment(): Text.HorzAlignment{
        return this.__horz_align
    }
    set textHorzAlignment(align: Text.HorzAlignment){
        this.__horz_align = align
    }

    private __applyAlighment(){
        let vert = TEXT_JUSTIFY_MIDDLE
        if (this.__vert_align == 'JUSTIFYBOTTOM'){vert = TEXT_JUSTIFY_BOTTOM} else
        if (this.__vert_align == 'JUSTIFYTOP'){vert = TEXT_JUSTIFY_TOP}

        let horz = TEXT_JUSTIFY_CENTER
        if (this.__horz_align == 'JUSTIFYLEFT'){horz = TEXT_JUSTIFY_LEFT} else 
        if (this.__horz_align == 'JUSTIFYRIGHT'){horz = TEXT_JUSTIFY_RIGHT}

        BlzFrameSetTextAlignment(this.handle, vert, horz)
    }

    private __text: string;
    private __vert_align: Text.VertAlignment;
    private __horz_align: Text.HorzAlignment;
}

export namespace Text {
    export type VertAlignment = 'JUSTIFYTOP' | 'JUSTIFYMIDDLE' | 'JUSTIFYBOTTOM'
    export type HorzAlignment = 'JUSTIFYLEFT' | 'JUSTIFYCENTER' | 'JUSTIFYRIGHT'

}

const DefaultFdf = new Fdf.Text(Text.name + 'DefaultFdf')
DefaultFdf.width = 0.04
DefaultFdf.height = 0.04
DefaultFdf.font = 'fonts\\nim_____.ttf'
DefaultFdf.fontSize = 0.008
DefaultFdf.justification = ['JUSTIFYCENTER', 'JUSTIFYMIDDLE']