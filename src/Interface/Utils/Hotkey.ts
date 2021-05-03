import * as Frame from "../../FrameExt";
import * as WcIO from '../../WcIO'
import { Vec2 } from '../../Math'
import { Action, EventActions } from '../../Utils'

export class InterfaceHotkey extends Frame.Backdrop {
    constructor(){
        super()
        
        this.visible = false
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'

        this.__fake_visible = false
        this.__text = new Frame.SimpleText()
        this.__text.parent = this
        this.__text.pos = new Vec2(0, 0)
        this.__text.size = this.size
        this.__text.font = 'fonts\\nim_____.ttf'
    }

    get key(){return this.__key}
    set key(key: joskeytype | undefined){
        if (this.__key){
            WcIO.Keyboard.actions.remove(this.__key, this.__act_up)
            WcIO.Keyboard.actions.remove(this.__key, this.__act_down)
        }

        this.__key = key
        this.__text.text = key ? WcIO.Keyboard.keyToString(key) : ''
        this.visible = this.visible
        if (key){
            this.__act_up = WcIO.Keyboard.actions.add(key, 'UP', (e, pl, k, m) => {
                print('up')
                this.actions.run('UP', this, pl)
            })
            this.__act_down = WcIO.Keyboard.actions.add(key, 'DOWN', (e, pl, k, m) => {
                print('down')
                this.actions.run('DOWN', this, pl)
            })
        }
    }

    destroy(){
        if (this.__key){
            WcIO.Keyboard.actions.remove(this.__key, this.__act_up)
            WcIO.Keyboard.actions.remove(this.__key, this.__act_down)
        }
        super.destroy()
    }

    protected _set_size(size: Vec2){
        super._set_size(size)
        this.__text.size = size
        this.__text.fontSize = 0.8 * size.y
    }

    protected _get_visible(){return this.__fake_visible}
    protected _set_visible(f: boolean){
        this.__fake_visible = f
        super._set_visible(f && (this.__key != undefined))
    }

    readonly actions = new EventActions<InterfaceHotkey.Event, [InterfaceHotkey, jplayer]>()

    private __fake_visible: boolean
    private __key: joskeytype | undefined;
    private __act_up: Action<[WcIO.Keyboard.Event, jplayer, joskeytype, number], void> | undefined
    private __act_down: Action<[WcIO.Keyboard.Event, jplayer, joskeytype, number], void> | undefined

    private __text: Frame.SimpleText
}

export namespace InterfaceHotkey{
    export type Event = 'UP' | 'DOWN'
}
