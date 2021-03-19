import * as Utils from '../../Utils'

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
    protected _set_pos(v: Utils.Vec2){
        let parent = this.parent
        let parent_abs_pos = parent ? parent.abs_pos : new Utils.Vec2(0, 0)
        let size = this.size

        let new_min = parent_abs_pos.add(v)
        let new_max = new_min.add(size)

        let sc_pos = Screen.pos
        let sc_size = Screen.size
        if (new_min.x < sc_pos.x || new_min.y < sc_pos.y
            || new_max.x > sc_size.x, new_max.y > sc_size.y){

            Utils.Log.wrn(OriginPortrait.name + 
                          ': can not be moved correctly outside of screen')

            new_min.x = Math.max(new_min.x, sc_pos.x + 0.0001)
            new_min.y = Math.max(new_min.y, sc_pos.y + 0.0001)

            let sc_max = sc_pos.add(sc_size)
            let size_max = sc_max.sub(new_min)
            size.x = Math.min(size.x, size_max.x - 0.0001)
            size.y = Math.min(size.y, size_max.y - 0.0001)
        }

        let real_pos = parent_abs_pos.add(new_min)
        real_pos.x = 0.8 / Screen.size.x * (real_pos.x - Screen.pos.x)

        let real_size = size.copy()
        real_size.x = 0.8 / Screen.size.x * real_size.x

        super._set_pos(real_pos)
        super._set_size(real_size)
    }

    protected _get_size(){return this.__fake_size.copy()}
    protected _set_size(v: Utils.Vec2){
        let parent = this.parent
        let parent_abs_pos = parent ? parent.abs_pos : new Utils.Vec2(0, 0)
        let size = v.copy()

        let new_min = this.abs_pos
        let new_max = new_min.add(v)

        let sc_pos = Screen.pos
        let sc_size = Screen.size
        if (new_min.x < sc_pos.x || new_min.y < sc_pos.y
            || new_max.x > sc_size.x, new_max.y > sc_size.y){

            Utils.Log.wrn(OriginPortrait.name + 
                          ': can not be moved correctly outside of screen')

            new_min.x = Math.max(new_min.x, sc_pos.x + 0.0001)
            new_min.y = Math.max(new_min.y, sc_pos.y + 0.0001)

            let sc_max = sc_pos.add(sc_size)
            let size_max = sc_max.sub(new_min)
            size.x = Math.min(size.x, size_max.x - 0.0001)
            size.y = Math.min(size.y, size_max.y - 0.0001)
        }

        let real_pos = parent_abs_pos.add(new_min)
        real_pos.x = 0.8 / Screen.size.x * (real_pos.x - Screen.pos.x)

        let real_size = size.copy()
        real_size.x = 0.8 / Screen.size.x * real_size.x

        super._set_pos(real_pos)
        super._set_size(real_size)
    }
    
    private __fake_pos: Utils.Vec2 = new Utils.Vec2(0, 0)
    private __fake_size: Utils.Vec2 = new Utils.Vec2(0.1, 0.1)

    private constructor(handle: jframehandle){
        super(handle, false)
    }

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
            OriginPortrait.__instance.pos = new Utils.Vec2(0, 0)
            OriginPortrait.__instance.size = new Utils.Vec2(0.1, 0.1)

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