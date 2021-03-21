import * as Fdf from '../../../Fdf'
import { Log } from '../../../Utils'
import { Frame } from "../../Frame";

export class SimpleStatusBar extends Frame {

    constructor(handle_or_fdf?: jframehandle | Fdf.SimpleStatusBar){
        handle_or_fdf = handle_or_fdf ? handle_or_fdf : DefaultFdf
        super(handle_or_fdf, true)
        
        this.__fullness = 0
        this.__texture = ''
        this.__texture_flags = 0
        this.__texture_blend = true
    }

    get texture(){return this.__texture}
    set texture(path: string){
        this.__texture = path
        BlzFrameSetTexture(this.handle, this.__texture, this.__texture_flags, this.__texture_blend)
    }

    get textureFlags(){return this.__texture_flags}
    set textureFlags(flags: number){
        this.__texture_flags = flags
        BlzFrameSetTexture(this.handle, this.__texture, this.__texture_flags, this.__texture_blend)
    }

    get textureBlend(){return this.__texture_blend}
    set textureBlend(flag: boolean){
        this.__texture_blend = flag
        BlzFrameSetTexture(this.handle, this.__texture, this.__texture_flags, this.__texture_blend)
    }

    get fullness(){return this.__fullness}
    set fullness(fullness: number){
        this.__fullness = fullness < 0 ? 0 : fullness > 1 ? 1 : fullness
        BlzFrameSetValue(this.handle, 100 * this.__fullness)
    }

    private __texture: string;
    private __texture_flags: number;
    private __texture_blend: boolean;
    private __fullness: number;
}

let DefaultFdf = new Fdf.SimpleStatusBar(SimpleStatusBar.name + 'DefaultFdf')
DefaultFdf.width = 0.04
DefaultFdf.height = 0.01
DefaultFdf.barTexture = 'Replaceabletextures\\Teamcolor\\Teamcolor00.blp'