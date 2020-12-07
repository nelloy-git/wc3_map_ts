import { Screen } from "../Screen";
import { hTimer } from "../../Handle";
import { Log } from "../../Utils";
import { OriginFrame } from './OriginFrame'
import { Frame } from "..";

/** Unique properties. */
export class OriginPortrait extends OriginFrame {
    static instance(){return OriginPortrait._instance} 

    get pos(){return [this.__x, this.__y]}
    set pos(pos: [x: number, y: number]){
        [this.__x, this.__y] = pos
        let [px, py] = this.parent ? this.parent.absPos : [0, 0]

        let real_x = px + this.__x
        let real_y = py + this.__y

        real_x = 0.8 / Screen.size[0] * (real_x - Screen.pos[0])
        real_y = real_y
        let [real_w, real_h] = this._get_size()
        
        /** Bugged when outside screen. */
        real_x = real_x < 0.001 ? 0.001 : (real_x + real_w) > 0.799 ? 0.799 - real_w : real_x
        real_y = real_y < 0.001 ? 0.001 : (real_y + real_h) > 0.599 ? 0.599 - real_h : real_y

        this._set_pos([real_x, real_y])
        this._set_size([real_w, real_h])
    }

    get size(){return [this.__w, this.__h]}
    set size(size: [w: number, h: number]){
        [this.__w, this.__h] = size

        let [real_x, real_y] = this._get_pos()
        let real_w = 0.8 / Screen.size[0] * this.__w
        let real_h = this.__h
        
        /** Bugged when outside screen. */
        real_x = real_x < 0.001 ? 0.001 : (real_x + real_w) > 0.799 ? 0.799 - real_w : real_x
        real_y = real_y < 0.001 ? 0.001 : (real_y + real_h) > 0.599 ? 0.599 - real_h : real_y

        this._set_pos([real_x, real_y])
        this._set_size([real_w, real_h])
    }

    get parent(){return null}
    set parent(parent: Frame | null){
        Log.err(OriginPortrait.name + 
                ': parentness disabled.')
    }
    
    private __x: number = 0
    private __y: number = 0
    private __w: number = 0
    private __h: number = 0

    private static _instance: OriginFrame | undefined;
    private static _init_timer = IsGame() ? (() => {
        let t = new hTimer()
        t.addAction(() => {
            let handle = BlzGetOriginFrame(ORIGIN_FRAME_PORTRAIT, 0)
            let is_simple = false
            if (!handle){return Log.err(OriginPortrait.name + 
                                        ': static instance has not been crated')}
            
            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, undefined)

            OriginPortrait._instance = new OriginPortrait(handle, is_simple)
            OriginPortrait._instance.pos = [0, 0]
            OriginPortrait._instance.size = [0.1, 0.1]

            Screen.addAction(() => {
                if (!OriginPortrait._instance){return}

                OriginPortrait._instance.pos = OriginPortrait._instance.pos
                OriginPortrait._instance.size = OriginPortrait._instance.size
            })

            t.destroy()
        })
        t.start(0, false)
    })() : undefined;
}

/** Portrait have hardcoded bind to some element. Bottom corner does not move in other ways. */
if (IsGame()){
    BlzEnableUIAutoPosition(false)
    BlzFrameSetAbsPoint(BlzGetFrameByName("ConsoleUI", 0), FRAMEPOINT_BOTTOM, 0.4, -0.18)
    BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0))
}