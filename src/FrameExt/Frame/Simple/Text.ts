import { Log } from '../../../Utils'
import { FdfSimpleFrame } from '../../Fdf/Simple/Frame';
import { FdfSimpleString } from '../../Fdf/Simple/String';
import { Frame } from "../../Frame";
import { SimpleString } from './String';

export class SimpleText extends Frame {
    constructor()
    constructor(handle: jframehandle, string: SimpleString)
    constructor(handle?: jframehandle, string?: SimpleString){
        if (!handle){
            super(SimpleText._default_fdf)
            this._string = new SimpleString(BlzGetFrameByName(SimpleText.name + 'DefaultFdfString', 0))
        } else {
            super(handle, true)
            this._string = string as SimpleString
        }
    }

    public get text(){return this._string.text}
    public set text(text: string){this._string.text = text}
    
    public get font(){return this._string.font}
    public set font(font: string){this._string.font = font}
    
    public get fontSize(){return this._string.fontSize}
    public set fontSize(size: number){this._string.fontSize = size}
    
    public get fontFlags(){return this._string.fontFlags}
    public set fontFlags(flags: number){this._string.fontFlags = flags}

    public addAction(){
        return Log.err(SimpleText.name + 
                       ': events are not available.')
    }
    public removeAction(){
        return Log.err(SimpleText.name + 
                       ': events are not available.')
    }

    private _string: SimpleString;

    private static _default_fdf = (()=>{
        let fdf = new FdfSimpleFrame(SimpleText.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04
        let text = new FdfSimpleString(SimpleText.name + 'DefaultFdfString')
            text.text = ''
            text.font = 'fonts\\nim_____.ttf'
            text.fontSize = 0.008
        fdf.addSubframe(text)
        return fdf
    })()
}