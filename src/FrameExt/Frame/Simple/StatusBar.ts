import { Log } from '../../../Utils'
import { FdfSimpleFrame } from '../../Fdf/Simple/Frame';
import { FdfSimpleTexture } from '../../Fdf/Simple/Texture';
import { Frame } from "../../Frame";
import { SimpleTexture } from './Texture';

export class SimpleStatusBar extends Frame {
    constructor()
    constructor(handle: jframehandle, texture: jframehandle)
    constructor(handle?: jframehandle, texture?: jframehandle){
        if (!handle){
            super(SimpleStatusBar._default_fdf)
        } else {
            super(handle, true)
        }
    }

    public addAction(){
        return Log.err(SimpleStatusBar.name + 
                       ': events are not available.')
    }
    public removeAction(){
        return Log.err(SimpleStatusBar.name + 
                       ': events are not available.')
    }


    private static _default_fdf = (()=>{
        let fdf = new FdfSimpleStatusBar(SimpleStatusBar.name + 'DefaultFdf')
        fdf.width = 0.04
        fdf.height = 0.04
            let texture = new FdfSimpleTexture(SimpleStatusBar.name + 'DefaultFdfTexture')
            texture.textureFile = ''
        fdf.addSubframe(texture)
        return fdf
    })()
}