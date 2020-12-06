import { hTimer } from "../../Handle";
import { Log } from "../../Utils";
import { OriginFrame } from './OriginFrame'

/** Unique properties. */
export class OriginTooltip extends OriginFrame {
    public static instance(){return OriginTooltip._instance} 

    private static _instance: OriginFrame | undefined;
    private static _init_timer = IsGame() ? (() => {
        let t = new hTimer()
        t.addAction(() => {
            let handle = BlzGetOriginFrame(ORIGIN_FRAME_UBERTOOLTIP, 0)
            if (!handle){return Log.err(OriginTooltip.name + 
                                        ': static instance has not been created')}
            let is_simple = false
            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))

            OriginTooltip._instance = new OriginTooltip(handle, is_simple)
            t.destroy()
        })
        t.start(0, false)
    })() : undefined;
}