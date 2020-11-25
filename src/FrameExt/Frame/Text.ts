import { Log } from "../../Utils";
import { FdfText as FdfText} from '../Fdf/Text'
import { Frame } from "../Frame";

export class Text extends Frame {
    constructor()
    constructor(fdf: FdfText)
    constructor(handle: jframehandle)
    constructor(handle?: FdfText|jframehandle){
        if (!handle){handle = Text._default_fdf}

        if (handle instanceof FdfText){
            super(handle)
            this._text = handle.text
        } else {
            super(handle, false)
            this._text = ''
        }
    }

    public get text(){return this._text}
    public set text(text: string){
        this._text = text
        BlzFrameSetText(this.handle, text)
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

    private static _default_fdf = (()=>{
        let fdf = new FdfText(Text.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04
        fdf.font = 'fonts\\nim_____.ttf'
        fdf.fontSize = 0.008
        fdf.justification = ['JUSTIFYCENTER', 'JUSTIFYMIDDLE']
        return fdf
    })()
}