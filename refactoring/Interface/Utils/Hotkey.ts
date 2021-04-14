import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt";
import * as WcIO from '../../WcIO'
import { Action, Vec2 } from '../../../src/Utils'

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

        this.__keyboard_action = WcIO.Keyboard.addAction((
            pl: jplayer, key: joskeytype, meta: number, is_down: boolean)=>{
                this.__keyPressed(pl, key, meta, is_down)
            }
        )
    }

    get key(){return this.__key}
    set key(key: joskeytype | undefined){
        this.__key = key
        this.visible = this.visible
        if (key){
            this.__text.text = WcIO.Keyboard.keyToString(key)
        }
    }

    set action(callback: (this: void, pl: jplayer, meta: number, is_down: boolean)=>void){
        this.__action = new Action(callback)
    }

    destroy(){
        super.destroy()
        WcIO.Keyboard.removeAction(this.__keyboard_action)
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

    private __keyPressed(pl: jplayer, key: joskeytype, meta: number, is_down: boolean){
        if (pl != GetLocalPlayer()){return}
        if (key != this.key){return}

        if (this.__action){this.__action.run(pl, meta, is_down)}
    }

    private __fake_visible: boolean
    private __key: joskeytype | undefined;
    private __keyboard_action: Action<[jplayer, joskeytype, number, boolean], void> | undefined
    private __action: Action<[jplayer, number, boolean], void> | undefined;

    private __text: Frame.SimpleText
}