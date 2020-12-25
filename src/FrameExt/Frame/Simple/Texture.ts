import { Log } from '../../../Utils'
import { Frame } from "../../Frame";

export class SimpleTexture extends Frame {
    constructor(handle: jframehandle){
        super(handle, true)
        
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

    private _texture: string;
    private _texture_flags: number;
    private _texture_blend: boolean;
}