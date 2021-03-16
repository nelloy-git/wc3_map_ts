import * as Fdf from '../../Fdf'
import { Log } from "../../Utils";
import { Frame } from "../FrameOld";

export class Backdrop extends Frame {
    constructor()
    constructor(fdf: Fdf.Backdrop)
    constructor(handle: jframehandle)
    constructor(handle?: Fdf.Backdrop | jframehandle){
        if (!handle){handle = Backdrop._default_fdf}

        if (handle instanceof Fdf.Backdrop){
            super(handle)
            this._texture = handle.background
        } else {
            super(handle, false)
            this._texture = ''
        }
        this._texture_flags = 0
        this._texture_blend = true
    }

    public get texture(){return this._texture}
    public set texture(path: string | undefined){
        this._texture = path ? path : ''
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

    private _texture: string;
    private _texture_flags: number;
    private _texture_blend: boolean;

    private static _default_fdf = (()=>{
        let fdf = new Fdf.Backdrop(Backdrop.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04
        fdf.background = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-background'
        return fdf
    })()
}