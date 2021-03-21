import * as Utils from '../../Utils'
import { Vec2 } from '../../Utils'

import { onPreInit } from '../Init'
import { Frame } from '../Frame'
import { Screen } from '../Screen'

/** Unique properties. */
export class OriginPortrait extends Frame {
    static inst(){
        if (!OriginPortrait.__instance){
            return Utils.Log.err('can not get origin frame before FrameExt finish initialization.')
        }
        return OriginPortrait.__instance
    } 

    protected _get_pos(){return this.__fake_pos.copy()}
    protected _set_pos(v: Vec2){
        this.__fake_pos = v.copy()
        let [pos, size] = this.__portraitCoord()

        BlzFrameSetAbsPoint(this.handle, FRAMEPOINT_TOPLEFT,
                            pos.x, 0.6 - pos.y)
        super._set_size(size)
    }

    protected _get_size(){return this.__fake_size.copy()}
    protected _set_size(v: Vec2){
        this.__fake_size = v.copy()
        let [pos, size] = this.__portraitCoord()

        BlzFrameSetAbsPoint(this.handle, FRAMEPOINT_TOPLEFT,
                            pos.x, 0.6 - pos.y)
        super._set_size(size)
    }

    private constructor(handle: jframehandle){
        super(handle, false)
    }

    private __portraitCoord(): [pos: Vec2, size: Vec2]{
        let pos1 = this.abs_pos
        let pos2 = this.__fake_size.copy().add(pos1)

        let sc_pos1 = Screen.pos
        let sc_pos2 = sc_pos1.add(Screen.size)

        pos1 = new Vec2(Math.max(sc_pos1.x + 0.0001, pos1.x),
                        Math.max(sc_pos1.y + 0.0001, pos1.y))
        pos1 = new Vec2(Math.min(sc_pos2.x - 0.0001, pos1.x),
                        Math.min(sc_pos2.y - 0.0001, pos1.y))

        pos2 = new Vec2(Math.max(sc_pos1.x + 0.0001, pos2.x),
                        Math.max(sc_pos1.y + 0.0001, pos2.y))
        pos2 = new Vec2(Math.min(sc_pos2.x - 0.0001, pos2.x),
                        Math.min(sc_pos2.y - 0.0001, pos2.y))

        
        let k = 0.8 / Screen.size.x
        pos1.x = k * (pos1.x - sc_pos1.x)
        pos2.x = k * (pos2.x - sc_pos1.x)

        let size = pos2.sub(pos1)

        return [pos1, size]
    }
    
    private __fake_pos: Vec2 = new Vec2(0, 0)
    private __fake_size: Vec2 = new Vec2(0.1, 0.1)

    private static __instance: OriginPortrait = <OriginPortrait><unknown>undefined
    private static __pre_init_action = (()=>{
        return onPreInit(()=>{
            let handle = BlzGetOriginFrame(ORIGIN_FRAME_PORTRAIT, 0)
            if (!handle){
                return Utils.Log.wrn('can not init ' + OriginPortrait.name)
            }

            BlzFrameClearAllPoints(handle)
            BlzFrameSetParent(handle, BlzGetFrameByName("ConsoleUIBackdrop", 0))
        
            OriginPortrait.__instance = new OriginPortrait(handle)
            OriginPortrait.__instance.pos = new Vec2(0, 0)
            OriginPortrait.__instance.size = new Vec2(0.1, 0.1)

            Screen.addAction(() => {
                if (!OriginPortrait.__instance){return}

                OriginPortrait.__instance.pos = OriginPortrait.__instance.pos
                OriginPortrait.__instance.size = OriginPortrait.__instance.size
            })
        })
    })()
}

/** Portrait have hardcoded bind to some element. Bottom corner does not move in other ways. */
if (IsGame()){
    BlzEnableUIAutoPosition(false)
    BlzFrameSetAbsPoint(BlzGetFrameByName("ConsoleUI", 0), FRAMEPOINT_BOTTOM, 0.4, -0.18)
    BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0))
}