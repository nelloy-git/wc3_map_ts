import { hTimer } from "../../Handle";
import { Log } from "../../Utils";
import { OriginFrame } from './OriginFrame'

/** Unique properties. */
export class OriginChatEditBox extends OriginFrame {
    public static instance(){return OriginChatEditBox._instance} 

    public set pos(pos: [x: number, y: number]){
        let parent = this.parent

        let p_abs_pos = parent?.absPos
        let [px, py] = p_abs_pos ? p_abs_pos : [0, 0]

        let [x, y] = this.pos
        let abs_x = px + x
        let abs_y = py + y

        let [w, h] = this.size

        if (abs_x < 0 || abs_y < 0 || abs_x + w > 0.8 || abs_y + h > 0.6){
            Log.wrn(OriginChatEditBox.name + 
                    ': can not be moved correctly outside of [[0, 0], [0.8, 0.6]]' + 
                    ' default zone.')
        }

        super.pos = pos
    }

    public set size(size: [w: number, h: number]){
        let [abs_x, abs_y] = this.absPos
        let [w, h] = size

        if (abs_x < 0 || abs_y < 0 || abs_x + w > 0.8 || abs_y + h > 0.6){
            Log.wrn(OriginChatEditBox.name + 
                    ': can not be moved outside of [[0, 0], [0.8, 0.6]]' + 
                    ' default zone.')
        }

        super.size = size
    }

    private static _instance: OriginFrame | undefined;
    private static _init_timer = IsGame() ? (() => {
        let t = new hTimer()
        t.addAction(() => {
            let handle = BlzFrameGetChild(BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 11)
            if (!handle){return Log.err(OriginChatEditBox.name + 
                                        ': static instance has not been created')}
            let is_simple = false
            
            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, undefined)

            OriginChatEditBox._instance = new OriginChatEditBox(handle, is_simple)
            t.destroy()
        })
        t.start(0, false)
    })() : undefined;
}