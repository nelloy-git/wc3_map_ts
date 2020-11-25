import { Timer } from "../Handle";
import { Action, ActionList } from "../Utils";

export class Screen {

    public static get pos(): [x: number, y: number]{return [Screen._x, Screen._y]}
    public static get size(): [w: number, h: number]{return [Screen._w, Screen._h]}

    public static addAction(callback: (this: void,
                                       pos: [x: number, y: number],
                                       size: [w: number, h: number])
                                       =>void){
        return Screen._actions.add(callback)
    }

    public static removeAction(action: Action<[[number, number], [number, number]], void>){
        return Screen._actions.remove(action)
    }

    private static _x: number = 0;
    private static _y: number = 0;
    private static _w: number = 0.8;
    private static _h: number = 0.6;

    private static _actions = new ActionList<[[x: number, y: number], [w: number, h: number]]>()

    private static _pixel_width = 0;
    private static _pixel_height = 0;
    private static _update(this: void){
        let cur_pixel_width = BlzGetLocalClientWidth()
        let cur_pixel_height = BlzGetLocalClientHeight()

        if (cur_pixel_width == Screen._pixel_width &&
            cur_pixel_height == Screen._pixel_height){

            return
        }

        Screen._pixel_width = cur_pixel_width
        Screen._pixel_height = cur_pixel_height

        let default_zone_width = cur_pixel_height * 0.8 / 0.6
        Screen._w = 0.8 * cur_pixel_width / default_zone_width
        Screen._x = - (Screen._w - 0.8) / 2

        Screen._actions.run(Screen.pos, Screen.size)
    }

    private static _init_timer = IsGame() ? (() => {
        let t = new Timer()
        t.addAction(() => {Screen._update(); t.destroy()})
        t.start(0.01, false)
    })() : undefined

    private static _update_timer = IsGame() ? (() => {
        let t = new Timer()
        t.addAction(Screen._update)
        t.start(1, true)
        return t
    })() : undefined

    /** Static class. */
    private constructor(){}
}