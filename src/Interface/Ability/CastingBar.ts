import { Abil, Container } from "../../Abil";
import { SimpleStatusBarExt } from "../../FrameExt";
import { hMultiTimer, hMultiTimerSub } from "../../Handle";
import { Action, log } from "../../Utils";

// import { IUnit } from "../Unit";

export class InterfaceCastingBar extends SimpleStatusBarExt {
    constructor(){
        super()
        this.__actions = []
        this.__timer = InterfaceCastingBar.__multitimer.add()
        this.__timer.actions.add('FINISH', ()=>{
            this.__is_visible = false
            this.visible = this.parent ? this.parent.visible : true
        })
    }

    get abils(){return this.__abils}
    set abils(abils: Container | undefined){
        if (this.__abils){
            let removed = true
            for (let i = 0; i < this.__actions.length; i++){
                let act = this.__actions[i]
                removed = removed && this.__abils.actions.remove(act)
            }

            if (!removed){
                log(this.toString() + ': can not remove actions from previous ability container.', 'Wrn')
            }
        }

        this.__abils = abils
        this.__is_visible = false
        if (this.__timer.running){
            this.__timer.stop()
        }
        if (!abils){
            return
        }

        let act_start = abils.actions.add('CASTING_START',
            (e, cont, abil) => {this.__cast_start(abil)})
        let act_loop = abils.actions.add('CASTING_LOOP',
            (e, cont, abil) => {this.__cast_loop(abil)})
        let act_cancel = abils.actions.add('CASTING_CANCEL',
            (e, cont, abil) => {this.__cast_cancel(abil)})
        let act_interrupt = abils.actions.add('CASTING_INTERRUPT',
            (e, cont, abil) => {this.__cast_interrupt(abil)})
        let act_finish = abils.actions.add('CASTING_FINISH',
            (e, cont, abil) => {this.__cast_finish(abil)})
        this.__actions = [act_start, act_loop, act_cancel, act_interrupt, act_finish]
    }

    protected _set_visible(flag: boolean){
        super._set_visible(flag && this.__is_visible)
    }

    private __cast_start(abil: Abil<any>){
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor17.blp'
        let text = this.getElement('TEXT')
        if (text){text.text = ''}
        this.fullness = 0
        
        this.__timer.stop()
        this.__is_visible = true
        this.visible = this.parent ? this.parent.visible : true
    }

    private __cast_loop(abil: Abil<any>){
        let text = this.getElement('TEXT')
        if (text){
            text.text = string.format('%s (%.1f / %.1f)',
                abil.Data.name, abil.Casting.timer.left, abil.Casting.timer.fullTime)
        }
        this.fullness = 1 - (abil.Casting.timer.left / abil.Casting.timer.fullTime)

        this.__is_visible = true
        this.visible = this.parent ? this.parent.visible : true
    }

    private __cast_cancel(abil: Abil<any>){
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor10.blp'
        let text = this.getElement('TEXT')
        if (text){
            text.text = abil.Data.name
        }
        this.visible = this.parent ? this.parent.visible : true
    }

    private __cast_interrupt(abil: Abil<any>){
        this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor12.blp'
        let text = this.getElement('TEXT')
        if (text){
            text.text = abil.Data.name
        }
        this.__timer.start(1)
        this.visible = this.parent ? this.parent.visible : true
    }
    
    private __cast_finish(abil: Abil<any>){
        let text = this.getElement('TEXT')
        if (text){text.text = abil.Data.name}
        this.fullness = 1
        this.__timer.start(1)
        this.visible = this.parent ? this.parent.visible : true
    }

    private __abils: Container | undefined
    private __actions: Action<[Container.Event, Container, Abil<any>], void>[]
    private __is_visible = false
    private __timer: hMultiTimerSub


    private static __multitimer = IsGame() ? new hMultiTimer(0.1)
                                           : <hMultiTimer><unknown>undefined
}