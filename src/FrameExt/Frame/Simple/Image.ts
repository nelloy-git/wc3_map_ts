import * as Fdf from '../../../Fdf'

import { Frame } from "../../Frame";
import { SimpleTexture } from './Texture';

export class SimpleImage extends Frame {

    constructor()
    constructor(fdf: Fdf.SimpleFrame, texture_name: string)
    constructor(handle: jframehandle, texture_name: string)
    constructor(handle_or_fdf?: jframehandle | Fdf.SimpleFrame, texture_name?: string){
        handle_or_fdf = handle_or_fdf ? handle_or_fdf : DefaultFdf
        super(handle_or_fdf, true)

        texture_name = texture_name ? texture_name : DefaultFdf.name + 'Texture'
        this.__texture = new SimpleTexture(BlzGetFrameByName(texture_name, 0))
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
    let texture = new Fdf.SimpleTexture(DefaultFdf.name + 'Texture')
    texture.textureFile = ''
    DefaultFdf.addSubframe(texture)
}