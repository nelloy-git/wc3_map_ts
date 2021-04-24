import { onPreInit } from '../Init'
import { Frame } from '../Frame'
import { Vec2 } from '../../Math'

export class OriginMinimap extends Frame {
    static inst(){
        if (!OriginMinimap.__instance){
            return error(OriginMinimap.name + 
                        ': can not get origin frame before FrameExt finish initialization.', 2)
        }
        return OriginMinimap.__instance
    }
    
    protected _set_size(size: Vec2){
        size.x = size.x > OriginMinimap.MIN_SIZE ? size.x : OriginMinimap.MIN_SIZE
        size.y = size.y > OriginMinimap.MIN_SIZE ? size.y : OriginMinimap.MIN_SIZE
        super._set_size(size)
    }

    private constructor(handle: jframehandle){
        super(handle, false)
    }

    private static __instance: OriginMinimap = <OriginMinimap><unknown>undefined
    private static __pre_init_action = (()=>{
        return onPreInit(()=>{
            let handle = BlzGetFrameByName("MiniMapFrame", 0)
            if (!handle){
                error(OriginMinimap.name + ': failed to init.')
            }

            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))
        
            OriginMinimap.__instance = new OriginMinimap(handle)
        })
    })()
}

export namespace OriginMinimap {
    export const MIN_SIZE = 0.05
}