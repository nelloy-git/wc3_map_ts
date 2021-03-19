import * as Fdf from '../../../Fdf'

import { Frame } from "../../Frame";
import { SimpleString } from './String';

export class SimpleText extends Frame {

    static fromFdf() : SimpleText
    static fromFdf(fdf: Fdf.SimpleFrame, text_name: string) : SimpleText
    static fromFdf(fdf?: Fdf.SimpleFrame, text_name?: string){
        fdf = fdf ? fdf : DefaultFdf
        let [handle, _] = Frame._fromFdf(fdf)

        text_name = text_name ? text_name : Fdf.SimpleFrame.name + 'DefaultFdfString'
        let f = new SimpleString(BlzGetFrameByName(text_name, 0))

        return new SimpleText(handle, f)
    }
    
    constructor(handle: jframehandle, string: SimpleString){
        super(handle, true)

        this.__string = string
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

    private static _default_fdf = (()=>{
        let fdf = new Fdf.SimpleFrame(SimpleText.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04
        let text = new Fdf.SimpleString(SimpleText.name + 'DefaultFdfString')
            text.text = ''
            text.font = 'fonts\\nim_____.ttf'
            text.fontSize = 0.008
        fdf.addSubframe(text)
        return fdf
    })()
}

let DefaultFdf = new Fdf.SimpleFrame(SimpleText.name + 'DefaultFdf')
DefaultFdf.width = 0.04
DefaultFdf.height = 0.04
{
    let text = new Fdf.SimpleString(SimpleText.name + 'DefaultFdfString')
    text.text = ''
    text.font = 'fonts\\nim_____.ttf'
    text.fontSize = 0.008
    DefaultFdf.addSubframe(text)
}