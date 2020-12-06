import { hTimer } from "../../Handle";
import { Log } from "../../Utils";
import { OriginFrame } from './OriginFrame'

/** Unique properties. */
export class OriginChatBox extends OriginFrame {
    public static instance(){return OriginChatBox._instance} 

    private static _instance: OriginFrame | undefined;
    private static _init_timer = IsGame() ? (() => {
        let t = new hTimer()
        t.addAction(() => {
            let handle = BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0)
            if (!handle){Log.err(OriginChatBox.name + 
                                 ': static instance has not been created')}
            let is_simple = false
            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))

            OriginChatBox._instance = new OriginChatBox(handle, is_simple)
            t.destroy()
        })
        t.start(0, false)
    })() : undefined;
}