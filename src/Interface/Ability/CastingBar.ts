import * as Abil from "../../AbilityExt";
import * as Frame from "../../FrameExt";

import { hTimerList, hTimerObj } from "../../Handle";
import { Action, Log } from "../../Utils";
import { IUnit } from "../Unit";

type CastAction = Action<[Abil.IFace<any>, Abil.Casting.Event, any], void>

export class InterfaceCastingBar extends Frame.SimpleStatusBarExt {
    constructor(){
        super()
        this._hide_timer = InterfaceCastingBar._timer_list.newTimerObj()
        this._hide_timer.addAction('FINISH', ()=>{
            this._is_visible = false
            this.visible = this.parent ? this.parent.visible : true
        })
    }

    get unit(){return this._unit}
    set unit(u: IUnit | undefined){
        if (this._unit){
            this._unit.abils.removeAction(this._update_list_act)
        }

        this._unit = u
        this._is_visible = false
        this._hide_timer.cancel()
        
        this._update_list(u ? u.abils : undefined)
        if (!u){return}

        this._update_list_act = u.abils.addAction('LIST_CHANGED', cont => {this._update_list(cont)})
    }

    protected _set_visible(flag: boolean){
        super._set_visible(flag && this._is_visible)
    }

    private _update_list(abil_cont: Abil.Container | undefined){
        for (let [abil, actions] of this._cast_actions){
            actions.forEach(action => {
                if (!abil.Casting.removeAction(action)){
                    Log.err(InterfaceCastingBar.name +
                            ': can not remove action.')
                }
            })
        }
        this._cast_actions = new Map<Abil.Ability<any>, (CastAction | undefined)[]>()

        if (!abil_cont){return}

        let list = abil_cont.list
        list.forEach(abil => {
            if (!abil){return}

            let actions: (CastAction | undefined)[] = []

            let start = abil.Casting.addAction('CAST_START', (abil, event) => {this._cast(abil, event)})
            let cast = abil.Casting.addAction('CAST_CASTING', (abil, event) => {this._cast(abil, event)})
            let cancel = abil.Casting.addAction('CAST_CANCEL', (abil, event) => {this._cast(abil, event)})
            let inter = abil.Casting.addAction('CAST_INTERRUPT', (abil, event) => {this._cast(abil, event)})
            let finish = abil.Casting.addAction('CAST_FINISH', (abil, event) => {this._cast(abil, event)})

            actions.push(start, cast, cancel, inter, finish)
            this._cast_actions.set(abil, actions)
        });
    }
    
    private _is_visible = false
    private _unit: IUnit | undefined
    private _update_list_act: Action<[Abil.Container, Abil.Container.Event], void> | undefined

    private _hide_timer: hTimerObj
    private _cast(abil: Abil.IFace<any>, event: Abil.Casting.Event){
        if (event == 'CAST_START'){
            this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor17.blp'
            let text = this.getElement('TEXT')
            if (text){text.text = ''}
            this.fullness = 0
            
            this._hide_timer.cancel()
            this._is_visible = true
        } else if (event == 'CAST_CASTING'){
            let text = this.getElement('TEXT')
            if (text){text.text = string.format('%s (%.1f / %.1f)',
                                                abil.Data.name, abil.Casting.timer.left, abil.Casting.timer.fullTime)}
            this.fullness = 1 - (abil.Casting.timer.left / abil.Casting.timer.fullTime)

            this._is_visible = true
        } else if (event == 'CAST_CANCEL') {
            this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor10.blp'
            let text = this.getElement('TEXT')
            if (text){text.text = abil.Data.name}
            this._hide_timer.start(1)
        } else if (event == 'CAST_INTERRUPT') {
            this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor12.blp'
            let text = this.getElement('TEXT')
            if (text){text.text = abil.Data.name}
            this._hide_timer.start(1)
        } else if (event == 'CAST_FINISH') {
            this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor22.blp'
            let text = this.getElement('TEXT')
            if (text){text.text = abil.Data.name}
            this.fullness = 1
            this._hide_timer.start(1)
        }
        this.visible = this.parent ? this.parent.visible : true
    }

    private _cast_actions = new Map<Abil.Ability<any>, (CastAction | undefined)[]>()
    private static _timer_list = new hTimerList(0.1)
}