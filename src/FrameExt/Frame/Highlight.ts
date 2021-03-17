import * as Fdf from '../../Fdf'

import { Frame } from "../Frame";

export class Highlight extends Frame {

    static fromFdf(fdf?: Fdf.Highlight){
        fdf = fdf ? fdf : DefaultFdf
        let [handle, _] = Frame._fromFdf(fdf)
        let f = new Highlight(handle)
        f.__texture = fdf.alphaFile
        return f
    }

    constructor(handle: jframehandle){
        super(handle, false)

        this.__texture = ''
        this.__texture_flags = 0
        this.__texture_blend = true
    }

    public get texture(){return this.__texture}
    public set texture(path: string){
        this.__texture = path
        BlzFrameSetTexture(this.handle, this.__texture, this.__texture_flags, this.__texture_blend)
    }

    public get textureFlags(){return this.__texture_flags}
    public set textureFlags(flags: number){
        this.__texture_flags = flags
        BlzFrameSetTexture(this.handle, this.__texture, this.__texture_flags, this.__texture_blend)
    }

    public get textureBlend(){return this.__texture_blend}
    public set textureBlend(flag: boolean){
        this.__texture_blend = flag
        BlzFrameSetTexture(this.handle, this.__texture, this.__texture_flags, this.__texture_blend)
    }

    private __texture: string;
    private __texture_flags: number;
    private __texture_blend: boolean;
}


const DefaultFdf = new Fdf.Highlight(Highlight.name + 'DefaultFdf')
DefaultFdf.width = 0.04
DefaultFdf.height = 0.04
DefaultFdf.alphaFile = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-background'