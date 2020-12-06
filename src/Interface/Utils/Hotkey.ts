import { Backdrop, Frame, SimpleText } from "../../FrameExt";
import { Keyboard } from "../../Input";
import { Action } from "../../Utils";

export class InterfaceHotkey extends Backdrop {
    constructor(){
        super()
        
        this.visible = false
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor27.blp'

        this._text.parent = this
        this._text.pos = [0, 0]
        this._text.size = this.size
        this._text.font = 'fonts\\nim_____.ttf'

        this._keyboard_action = Keyboard.addAction((
            pl: jplayer, key: joskeytype, meta: number, is_down: boolean)=>{
                this._keyPressed(pl, key, meta, is_down)
            }
        )
    }

    meta: number = 0;

    get size(){return this._get_size()}
    set size(size: [w: number, h: number]){
        this._set_size(size)
        this._text.size = size
        this._text.fontSize = 0.8 * size[1]
    }

    get key(){return this._key}
    set key(key: joskeytype | undefined){
        this._key = key
        this.visible = !(key == undefined)
        if (key){
            this._text.text = Keyboard.keyToString(key)
        }
    }

    set action(callback: (this: void, pl: jplayer, meta: number, is_down: boolean)=>void){
        this._action = new Action(callback)
    }

    destroy(){
        super.destroy()
        Keyboard.removeAction(this._keyboard_action)
    }

    private _keyPressed(pl: jplayer, key: joskeytype, meta: number, is_down: boolean){
        if (pl != GetLocalPlayer()){return}
        if (key != this.key){return}
        if (meta != this.meta){return}

        if (this._action){this._action.run(pl, meta, is_down)}
    }

    private _key: joskeytype | undefined;
    private _keyboard_action: Action<[jplayer, joskeytype, number, boolean], void> | undefined
    private _action: Action<[jplayer, number, boolean], void> | undefined;

    private _text = new SimpleText()
}