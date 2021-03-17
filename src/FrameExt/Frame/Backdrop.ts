import * as Fdf from '../../Fdf'

import { Frame } from "../Frame";

export class Backdrop extends Frame {

    static fromFdf(fdf?: Fdf.Backdrop){
        fdf = fdf ? fdf : DefaultFdf
        let [handle, _] = Frame._fromFdf(fdf)
        let f = new Backdrop(handle)
        f.__texture = fdf.background
        return f
    }

    constructor(handle: jframehandle){
        super(handle, false)

        this.__texture = ''
        this.__texture_flags = 0
        this.__texture_blend = true
    }

    public get texture(){return this.__texture}
    public set texture(path: string | undefined){
        this.__texture = path ? path : ''
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

const DefaultFdf = new Fdf.Backdrop(Backdrop.name + 'DefaultFdf')
DefaultFdf.width = 0.04
DefaultFdf.height = 0.04
DefaultFdf.background = 'UI\\Widgets\\ToolTips\\Human\\human-tooltip-background'