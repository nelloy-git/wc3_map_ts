import { hTimer } from "../../Handle";
import { Log } from "../../Utils";
import { OriginFrame } from './OriginFrame'

/** Unique properties. */
export class OriginInventory extends OriginFrame {
    public static instance(){return OriginInventory._instance} 

    private static _instance: OriginFrame | undefined;
    private static _init_timer = IsGame() ? (() => {
        let t = new hTimer()
        t.addAction(() => {
            let item_btn = BlzGetOriginFrame(ORIGIN_FRAME_ITEM_BUTTON, 0)
            if (!item_btn){return Log.err(OriginInventory.name + 
                                          ': static instance has not been created')}
                                          
            let item_parent = BlzFrameGetParent(item_btn)
            if (!item_parent){return Log.err(OriginInventory.name + 
                                             ': static instance has not been created')}
            
            let handle = BlzFrameGetParent(item_parent)
            if (!handle){return Log.err(OriginInventory.name + 
                                        ': static instance has not been created')}


            let is_simple = false
            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, undefined)

            OriginInventory._instance = new OriginInventory(handle, is_simple)
            t.destroy()
        })
        t.start(0, false)
    })() : undefined;
}