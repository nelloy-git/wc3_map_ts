import * as Fdf from '../../../Fdf'
import { Log } from '../../../Utils'
import { Frame } from "../../Frame";
import { SimpleTexture } from './Texture';

export class SimpleImage extends Frame {
    constructor()
    constructor(handle: jframehandle, texture: SimpleTexture)
    constructor(handle?: jframehandle, texture?: SimpleTexture){
        if (!handle){
            super(SimpleImage._default_fdf)
            this._texture = new SimpleTexture(BlzGetFrameByName(SimpleImage.name + 'DefaultFdfTexture', 0))
        } else {
            super(handle, true)
            this._texture = texture as SimpleTexture
        }
    }

    public get texture(){return this._texture.texture}
    public set texture(path: string){this._texture.texture = path}

    public get textureFlags(){return this._texture.textureFlags}
    public set textureFlags(flags: number){this._texture.textureFlags = flags}

    public get textureBlend(){return this._texture.textureBlend}
    public set textureBlend(flag: boolean){this._texture.textureBlend = flag}

    private _texture: SimpleTexture;

    private static _default_fdf = (()=>{
        let fdf = new Fdf.SimpleFrame(SimpleImage.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04
            let texture = new Fdf.SimpleTexture(SimpleImage.name + 'DefaultFdfTexture')
            texture.textureFile = ''
        fdf.addSubframe(texture)
        return fdf
    })()
}