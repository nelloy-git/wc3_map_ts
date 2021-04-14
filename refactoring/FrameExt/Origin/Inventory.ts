import * as Utils from '../../../src/Utils'

import { onPreInit } from '../Init'
import { Frame } from '../Frame'

export class OriginInventory extends Frame {
    static inst(){
        if (!OriginInventory.__instance){
            return Utils.Log.err('can not get origin frame before FrameExt finish initialization.')
        }
        return OriginInventory.__instance
    } 

    private constructor(handle: jframehandle){
        super(handle, false)
    }

    private static __instance: OriginInventory = <OriginInventory><unknown>undefined
    private static __pre_init_action = (()=>{
        return onPreInit(()=>{
            let item_btn = BlzGetOriginFrame(ORIGIN_FRAME_ITEM_BUTTON, 0)
            if (!item_btn){
                return Utils.Log.wrn('can not init ' + OriginInventory.name)
            }
                                          
            let item_parent = BlzFrameGetParent(item_btn)
            if (!item_parent){
                return Utils.Log.wrn('can not init ' + OriginInventory.name)
            }
            
            let handle = BlzFrameGetParent(item_parent)
            if (!handle){
                return Utils.Log.wrn('can not init ' + OriginInventory.name)
            }

            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))
        
            OriginInventory.__instance = new OriginInventory(handle)
        })
    })()
}