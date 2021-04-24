import * as Fdf from '../../../Fdf'

import { Frame } from "../../Frame";
import { SimpleString } from './String';

export class SimpleText extends Frame {

    constructor()
    constructor(fdf: Fdf.SimpleFrame, string_name: string)
    constructor(handle: jframehandle, string_name: string)
    constructor(handle_or_fdf?: jframehandle | Fdf.SimpleFrame, string_name?: string){
        handle_or_fdf = handle_or_fdf ? handle_or_fdf : DefaultFdf
        super(handle_or_fdf, true)

        string_name = string_name ? string_name : DefaultFdf.name + 'String'
        this.__string = new SimpleString(BlzGetFrameByName(string_name, 0))
    }

    public get text(){return this.__string.text}
    public set text(text: string){this.__string.text = text}
    
    public get font(){return this.__string.font}
    public set font(font: string){this.__string.font = font}
    
    public get fontSize(){return this.__string.fontSize}
    public set fontSize(size: number){this.__string.fontSize = size}
    
    public get fontFlags(){return this.__string.fontFlags}
    public set fontFlags(flags: number){this.__string.fontFlags = flags}

    private __string: SimpleString;
}

let DefaultFdf = new Fdf.SimpleFrame(SimpleText.name + 'DefaultFdf')
DefaultFdf.width = 0.04
DefaultFdf.height = 0.04
{
    let text = new Fdf.SimpleString(DefaultFdf.name + 'String')
    text.text = ''
    text.font = 'fonts\\nim_____.ttf'
    text.fontSize = 0.008
    DefaultFdf.addSubframe(text)
}