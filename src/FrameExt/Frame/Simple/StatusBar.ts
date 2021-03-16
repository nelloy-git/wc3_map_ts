import * as Fdf from '../../../Fdf'
import { Log } from '../../../Utils'
import { Frame } from "../../FrameOld";

export class SimpleStatusBar extends Frame {
    constructor()
    constructor(fdf: Fdf.SimpleStatusBar)
    constructor(handle: jframehandle)
    constructor(handle?: jframehandle | Fdf.SimpleStatusBar | undefined){
        if (!handle || handle instanceof Fdf.Fdf){
            let fdf = handle ? handle : SimpleStatusBar._default_fdf
            
            super(fdf)
            this._texture = fdf.barTexture
        } else {
            super(handle, true)
            this._texture = ''
        }

        this._fullness = 0
        this._texture_flags = 0
        this._texture_blend = true
    }

    get texture(){return this._texture}
    set texture(path: string){
        this._texture = path
        BlzFrameSetTexture(this.handle, this._texture, this._texture_flags, this._texture_blend)
    }

    get textureFlags(){return this._texture_flags}
    set textureFlags(flags: number){
        this._texture_flags = flags
        BlzFrameSetTexture(this.handle, this._texture, this._texture_flags, this._texture_blend)
    }

    get textureBlend(){return this._texture_blend}
    set textureBlend(flag: boolean){
        this._texture_blend = flag
        BlzFrameSetTexture(this.handle, this._texture, this._texture_flags, this._texture_blend)
    }

    get fullness(){return this._fullness}
    set fullness(fullness: number){
        this._fullness = fullness < 0 ? 0 : fullness > 1 ? 1 : fullness
        BlzFrameSetValue(this.handle, 100 * this._fullness)
    }

    private _texture: string;
    private _texture_flags: number;
    private _texture_blend: boolean;
    private _fullness: number;

    private static _default_fdf = (()=>{
        let name = SimpleStatusBar.name + 'DefaultFdf'

        let fdf = new Fdf.SimpleStatusBar(name)
        fdf.width = 0.04
        fdf.height = 0.01
        fdf.barTexture = 'Replaceabletextures\\Teamcolor\\Teamcolor00.blp'

        return fdf
    })()
}