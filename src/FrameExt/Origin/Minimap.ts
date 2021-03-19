import * as Utils from '../../Utils'

import { onPreInit } from '../Init'
import { Frame } from '../Frame'

export class OriginMinimap extends Frame {
    static inst(){
        if (!OriginMinimap.__instance){
            return Utils.Log.err('can not get origin frame before FrameExt finish initialization.')
        }
        return OriginMinimap.__instance
    } 

    private constructor(handle: jframehandle){
        super(handle, false)
    }

    private static __instance: OriginMinimap = <OriginMinimap><unknown>undefined
    private static __pre_init_action = (()=>{
        return onPreInit(()=>{
            let handle = BlzGetFrameByName("MiniMapFrame", 0)
            if (!handle){
                return Utils.Log.wrn('can not init ' + OriginMinimap.name)
            }

            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))
        
            OriginMinimap.__instance = new OriginMinimap(handle)
        })
    })()
}