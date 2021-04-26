import { Abil, Container } from "../../Abil";
import { SimpleStatusBarExt } from "../../FrameExt";
import { hMultiTimer, hMultiTimerSub } from "../../Handle";
import { Action, log } from "../../Utils";

import { IUnit } from "../Unit";

export class InterfaceCastingBar extends SimpleStatusBarExt {
    constructor(){
        super()
        this.__abil_actions = new Map()
        this.__timer = InterfaceCastingBar.__multitimer.add()
        this.__timer.actions.add('FINISH', ()=>{
            this.__is_visible = false
            this.visible = this.parent ? this.parent.visible : true
        })
    }

    get unit(){return this.__unit}
    set unit(u: IUnit | undefined){
        this.__removeActionsFromContainer()
        this.__removeActionsFromAbils()

        this.__unit = u
        this.__is_visible = false
        this.__timer.stop()
        
        this.__update_list(u ? u.abils : undefined)
        if (!u){return}

        this.__update_list_act = u.abils.addAction('LIST_CHANGED', cont => {this.__update_list(cont)})
    }

    protected _set_visible(flag: boolean){
        super._set_visible(flag && this.__is_visible)
    }

    private __removeActionsFromContainer(){
        if (!this.__unit){
            return
        }

        let removed = this.__unit.abils.actions.remove(this.__container_action)
        if (!removed){
            log(this.toString() + ': can not remove action from container.', 'Wrn')
        }
        this.__container_action = undefined

    }

    private __addActionsToContainer(){
        if (!this.__unit){
            return
        }
        this.__container_action = this.__unit.abils.actions.add('CHANGED', )
    }

    private __removeActionsFromAbils(){
        for (const [abil, list] of this.__abil_actions){
            for (const act of list){
                let removed = abil.actions.remove(act)
                if (!removed){
                    log(this.toString() + ': can not remove action from ability.', 'Wrn')
                }
            }
        }
        this.__abil_actions = new Map()
    }

    private __update_list(abil_cont: Container | undefined){
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

            let start = abil.Casting.addAction('CAST_START', (abil, event) => {this.__cast(abil, event)})
            let cast = abil.Casting.addAction('CAST_CASTING', (abil, event) => {this.__cast(abil, event)})
            let cancel = abil.Casting.addAction('CAST_CANCEL', (abil, event) => {this.__cast(abil, event)})
            let inter = abil.Casting.addAction('CAST_INTERRUPT', (abil, event) => {this.__cast(abil, event)})
            let finish = abil.Casting.addAction('CAST_FINISH', (abil, event) => {this.__cast(abil, event)})

            actions.push(start, cast, cancel, inter, finish)
            this._cast_actions.set(abil, actions)
        });
    }
    
    private __is_visible = false
    private __unit: IUnit | undefined
    private __container_action: Action<Container, [Container.Event, number]> | undefined
    // private __abil_actions: Map<Abil<any>, Action<Abil<any>>[]>
    // private __update_list_act: Action<[Abil.Container, Abil.Container.Event], void> | undefined

    private __timer: hMultiTimerSub
    private __cast1(abil: Abil.IFace<any>, event: Abil.Casting.Event){
        if (event == 'CAST_START'){
            this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor17.blp'
            let text = this.getElement('TEXT')
            if (text){text.text = ''}
            this.fullness = 0
            
            this.__timer.cancel()
            this.__is_visible = true
        } else if (event == 'CAST_CASTING'){
            let text = this.getElement('TEXT')
            if (text){text.text = string.format('%s (%.1f / %.1f)',
                                                abil.Data.name, abil.Casting.Timer.left, abil.Casting.Timer.fullTime)}
            this.fullness = 1 - (abil.Casting.Timer.left / abil.Casting.Timer.fullTime)

            this.__is_visible = true
        } else if (event == 'CAST_CANCEL') {
            this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor10.blp'
            let text = this.getElement('TEXT')
            if (text){text.text = abil.Data.name}
            this.__timer.start(1)
        } else if (event == 'CAST_INTERRUPT') {
            this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor12.blp'
            let text = this.getElement('TEXT')
            if (text){text.text = abil.Data.name}
            this.__timer.start(1)
        } else if (event == 'CAST_FINISH') {
            this.texture = 'Replaceabletextures\\Teamcolor\\Teamcolor22.blp'
            let text = this.getElement('TEXT')
            if (text){text.text = abil.Data.name}
            this.fullness = 1
            this.__timer.start(1)
        }
        this.visible = this.parent ? this.parent.visible : true
    }

    private __updateAbilByPos(container: Container, pos: number, prev: Abil<any> | undefined){
        // Clear previous ability actions.
        if (prev){
            const list = this.__abil_actions.get(pos)
            if (!list){
                log(this.toString() + ': prev != nil && actions[prev] == nil', 'Wrn')
                return
            }

            for (const act of list){
                const removed = prev.actions.remove(act)
                if (!removed){
                    log(this.toString() + ': can not remove action from previous ability', 'Wrn')
                }
            }
        }

        // Add new ability actions
        const abil = container.get(pos)
        if (abil){
            const list: Action<Abil<any>, [Abil.Event]>[] = []
            this.__abil_actions.set(pos, list)

            list.push(abil.actions.add('CASTING_START', (a) => {this.__cast['CASTING_START'](a)}))
        }
    }

    private __cast = {
        ['CASTING_START']: (abil: Abil<any>) => {

        }
    }

    private __cast_start(abil: Abil<any>){

    }

    private __cast_start(abil: Abil<any>){

    }

    private __cast_start(abil: Abil<any>){

    }

    private __cast_start(abil: Abil<any>){

    }

    private __abil_actions: Map<number, Action<Abil<any>, [Abil.Event]>[]>

    private _cast_actions = new Map<Abil<any>, (CastAction | undefined)[]>()


    private static __multitimer = IsGame() ? new hMultiTimer(0.1)
                                           : <hMultiTimer><unknown>undefined
}