import { Log } from '../../../Utils'
import { FdfSimpleFrame } from '../../Fdf/Simple/Frame';
import { FdfSimpleTexture } from '../../Fdf/Simple/Texture';
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

    public addAction(){
        return Log.err(SimpleImage.name + 
                       ': events are not available.')
    }
    public removeAction(){
        return Log.err(SimpleImage.name + 
                       ': events are not available.')
    }

    private _texture: SimpleTexture;

    private static _default_fdf = (()=>{
        let fdf = new FdfSimpleFrame(SimpleImage.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04
            let texture = new FdfSimpleTexture(SimpleImage.name + 'DefaultFdfTexture')
            texture.textureFile = ''
        fdf.addSubframe(texture)
        return fdf
    })()
}