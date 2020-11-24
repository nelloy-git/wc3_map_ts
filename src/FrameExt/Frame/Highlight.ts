import { Log } from "../../Utils";
import { FdfHighlight as FdfHighlight} from '../Fdf/Highlight'
import { Frame } from "../Frame";

export class Highlight extends Frame {
    constructor()
    constructor(fdf: FdfHighlight)
    constructor(handle: jframehandle)
    constructor(handle?: FdfHighlight|jframehandle){
        if (!handle){handle = Highlight._default_fdf}

        if (handle instanceof FdfHighlight){
            super(handle)
        } else {
            super(handle, false)
        }

        this._texture = ''
        this._texture_flags = 0
        this._texture_blend = true
    }

    public get texture(){return this._texture}
    public set texture(path: string){
        this._texture = path
        BlzFrameSetTexture(this.handle, this._texture, this._texture_flags, this._texture_blend)
    }

    public get textureFlags(){return this._texture_flags}
    public set textureFlags(flags: number){
        this._texture_flags = flags
        BlzFrameSetTexture(this.handle, this._texture, this._texture_flags, this._texture_blend)
    }

    public get textureBlend(){return this._texture_blend}
    public set textureBlend(flag: boolean){
        this._texture_blend = flag
        BlzFrameSetTexture(this.handle, this._texture, this._texture_flags, this._texture_blend)
    }

    public addAction(){
        return Log.err(Highlight.name + 
                       ': events are not available.')
    }
    public removeAction(){
        return Log.err(Highlight.name + 
                       ': events are not available.')
    }

    private _texture: string;
    private _texture_flags: number;
    private _texture_blend: boolean;

    private static _default_fdf = (()=>{
        let fdf = new FdfHighlight(Highlight.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04
        fdf.alphaFile = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-background'
        return fdf
    })()
}