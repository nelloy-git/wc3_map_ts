import * as Fdf from '../../../Fdf'

import { Frame } from "../../Frame";
import { SimpleTexture } from './Texture';

export class SimpleImage extends Frame {

    static fromFdf() : SimpleImage
    static fromFdf(fdf: Fdf.SimpleFrame, texture_name: string) : SimpleImage
    static fromFdf(fdf?: Fdf.SimpleFrame, texture_name?: string){
        fdf = fdf ? fdf : DefaultFdf
        let [handle, _] = Frame._fromFdf(fdf)

        texture_name = texture_name ? texture_name : SimpleImage.name + 'DefaultFdfTexture'
        let f = new SimpleTexture(BlzGetFrameByName(texture_name, 0))

        return new SimpleImage(handle, f)
    }

    constructor(handle: jframehandle, texture_frame: SimpleTexture){
        super(handle, true)

        this.__texture = texture_frame
    }

    public get texture(){return this.__texture.texture}
    public set texture(path: string){this.__texture.texture = path}

    public get textureFlags(){return this.__texture.textureFlags}
    public set textureFlags(flags: number){this.__texture.textureFlags = flags}

    public get textureBlend(){return this.__texture.textureBlend}
    public set textureBlend(flag: boolean){this.__texture.textureBlend = flag}

    private __texture: SimpleTexture;
}

let DefaultFdf = new Fdf.SimpleFrame(SimpleImage.name + 'DefaultFdf')
DefaultFdf.width = 0.04
DefaultFdf.height = 0.04
{
    let texture = new Fdf.SimpleTexture(SimpleImage.name + 'DefaultFdfTexture')
    texture.textureFile = ''
    DefaultFdf.addSubframe(texture)
}