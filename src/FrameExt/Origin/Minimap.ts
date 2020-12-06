import { hTimer } from "../../Handle";
import { Log } from "../../Utils";
import { OriginFrame } from './OriginFrame'

/** Unique properties. */
export class OriginMinimap extends OriginFrame {
    static instance(){return OriginMinimap._instance} 

    private static _instance: OriginFrame | undefined;
    private static _init_timer = IsGame() ? (() => {
        let t = new hTimer()
        t.addAction(() => {
            let handle = BlzGetFrameByName("MiniMapFrame", 0)
            if (!handle){return Log.err(OriginMinimap.name + 
                                        ': static instance has not been created')}

            let is_simple = false
            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))

            OriginMinimap._instance = new OriginMinimap(handle, is_simple)
            t.destroy()
        })
        t.start(0, false)
    })() : undefined;
}