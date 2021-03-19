import * as Handle from "../Handle";
import * as Utils from "../Utils"

import { onPreInit } from './Init'

export class Screen {
    
    public static get pos(): Utils.Vec2{return Screen.__pos.copy()}
    public static get size(): Utils.Vec2{return Screen.__size.copy()}

    public static addAction(callback: (this: void,
                                       pos: Utils.Vec2,
                                       size: Utils.Vec2) => void){
        return Screen.__actions.add(callback)
    }

    public static removeAction(action: Utils.Action<[Utils.Vec2, Utils.Vec2], void>){
        return Screen.__actions.remove(action)
    }

    private static __pos: Utils.Vec2 = new Utils.Vec2(0, 0)
    private static __size: Utils.Vec2 = new Utils.Vec2(0.8, 0.6)

    private static __actions = new Utils.ActionList<[pos: Utils.Vec2, size: Utils.Vec2]>()

    private static __pixel_width = 0;
    private static __pixel_height = 0;
    private static __update(this: void){
        let cur_pixel_width = BlzGetLocalClientWidth()
        let cur_pixel_height = BlzGetLocalClientHeight()

        if (cur_pixel_width == Screen.__pixel_width &&
            cur_pixel_height == Screen.__pixel_height){

            return
        }

        Screen.__pixel_width = cur_pixel_width
        Screen.__pixel_height = cur_pixel_height

        let default_zone_width = cur_pixel_height * 0.8 / 0.6
        Screen.__size.x = 0.8 * cur_pixel_width / default_zone_width
        Screen.__pos.x = - (Screen.__size.x - 0.8) / 2

        Screen.__actions.run(Screen.pos, Screen.size)
    }

    private static __update_timer = IsGame() ? new Handle.hTimer() : <Handle.hTimer><unknown>undefined
    private static __pre_init_action = (()=>{
        return onPreInit(()=>{
            Screen.__update()
            Screen.__update_timer.addAction(Screen.__update)
            Screen.__update_timer.start(1, true)
        })
    })()

    /** Static class. */
    private constructor(){}
}