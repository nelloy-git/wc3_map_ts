import { onPreInit } from '../Init'
import { Frame } from '../Frame'

export class OriginChatBox extends Frame {
    public static inst(){return __instance}

    // private static __instance: OriginChatBox;

    private constructor(handle: jframehandle){
        super(handle, false)
    }

    let __instance: OriginChatBox = IsGame() ? (() => {
        let handle = BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0)
        BlzFrameClearAllPoints(handle)
        BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))
    
        __instance = new Frame()


        let t = new hTimer()
        t.addAction(() => {
            let handle = BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0)
            if (!handle){Log.err(OriginChatBox.name + 
                                 ': static instance has not been created')}
            let is_simple = false
            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))

            OriginChatBox.__instance = new OriginChatBox(handle, is_simple)
            t.destroy()
        })
        t.start(0, false)
    })() : undefined;
}

let __instance: OriginChatBox
onPreInit(()=>{
    let handle = BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0)
    BlzFrameClearAllPoints(handle)
    BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))

    __instance = new Frame()
})