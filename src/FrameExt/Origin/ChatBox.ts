import * as Utils from '../../Utils'

import { onPreInit } from '../Init'
import { Frame } from '../Frame'

export class OriginChatBox extends Frame {
    public static inst(){
        if (!OriginChatBox.__instance){
            return error(OriginChatBox.name +
                        ': can not get origin frame before FrameExt finish initialization.', 2)
        }
        return OriginChatBox.__instance
    }

    private constructor(handle: jframehandle){
        super(handle, false)
    }

    private static __instance: OriginChatBox = <OriginChatBox><unknown>undefined
    private static __pre_init_action = (()=>{
        return onPreInit(()=>{
            let handle = BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0)
            if (!handle){
                error(OriginChatBox.name + ': failed to init.')
            }

            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))
        
            OriginChatBox.__instance = new OriginChatBox(handle)
        })
    })()
}