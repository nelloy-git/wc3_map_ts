import { hTimer } from '../Handle'
import { Vec2 } from '../Math'
import { ActionList } from '../Utils'

import { onPostInit } from './Init'

export class Screen {
    
    static get pos(): Vec2{return Screen.__pos.copy()}
    static get size(): Vec2{return Screen.__size.copy()}

    static update(this: void){
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

        Screen.actions.run(Screen.__pos.copy(), 
                           Screen.__size.copy())
    }

    static readonly actions = new ActionList<[pos: Vec2, size: Vec2]>(Screen.name)

    private static __pos: Vec2 = new Vec2(0, 0)
    private static __size: Vec2 = new Vec2(0.8, 0.6)

    private static __pixel_width = 0;
    private static __pixel_height = 0;

    /** Static class. */
    private constructor(){}
}

export namespace Screen {
    onPostInit(() => {
        let t = new hTimer()
        t.actions.add(Screen.update)
        t.start(1, true)
    })
}