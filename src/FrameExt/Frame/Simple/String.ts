import { Frame } from "../../Frame"

export class SimpleString extends Frame {

    constructor(handle: jframehandle, text?: string,
                font?: string, font_size?: number, font_flags?: number){
        super(handle, true)

        this.__text = text ? text : ''
        this.__font = font ? font : 'fonts\\nim_____.ttf'
        this.__font_size = font_size ? font_size : 0.008
        this.__font_flags = font_flags ? font_flags : 0
    }

    get text(){return this.__text}
    set text(text: string){
        this.__text = text
        BlzFrameSetText(this.handle, text)
    }

    get font(){return this.__font}
    set font(path: string){
        this.__font = path
        BlzFrameSetFont(this.handle, this.__font, this.__font_size, this.__font_flags)
    }

    get fontSize(){return this.__font_size}
    set fontSize(size: number){
        this.__font_size = size
        BlzFrameSetFont(this.handle, this.__font, this.__font_size, this.__font_flags)
    }

    get fontFlags(){return this.__font_flags}
    set fontFlags(flags: number){
        this.__font_flags = flags
        BlzFrameSetFont(this.handle, this.__font, this.__font_size, this.__font_flags)
    }

    private __text: string
    private __font: string
    private __font_size: number
    private __font_flags: number
}