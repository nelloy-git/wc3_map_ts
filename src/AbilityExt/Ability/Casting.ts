import * as Handle from '../../Handle'
import * as Utils from '../../Utils'

import { TCasting } from "../Type/Casting";
import { CastingIFace, IFace, TargetType } from "./IFace";

const __path__ = Macro(Utils.getFilePath())

export class Casting<T extends TargetType[]> implements CastingIFace<T> {
    constructor(abil: IFace<T>, type: TCasting<T>){
        this.abil = abil
        this.__type = type

        this.Timer = Casting._timer_list.newTimerObj()
        this.Timer.addAction('PERIOD', ()=>{this.__period()})
        this.Timer.addAction('FINISH', ()=>{this.__stop('CAST_FINISH')})
    }

    static getActive(caster: Handle.hUnit | undefined){
        if (!caster){return undefined}
        return Casting._caster2abil.get(caster)
    }

    static readonly period = 0.025
    readonly period = Casting.period
    
    start(target: T){
        if (!this.abil.Data.is_available){return false}
        if (!this.__type.isTargetValid(this.abil, target)){return false}

        let caster = this.abil.Data.owner

        // Cancel current ability
        let cur = Casting._caster2abil.get(caster)
        if (cur){cur.Casting.cancel()}
        Casting._caster2abil.set(this.abil.Data.owner, this.abil)

        // update charge cooldown
        this.abil.Data.Charges.cooldown = this.abil.Data.charge_cd
        if (!this.abil.Data.consume(target)){
            let t_name = this.abil.Data.name
            return Utils.Log.err('error in consuming resources.' + 
                                 'Check ' + t_name + '.isAvailable and' +
                                 t_name + '.consume methods.',
                                 __path__, Casting, 2)
        }

        let time = this.__type.castingTime(this.abil, target)
        time = time > 0 ? time : 0.01
        this.Timer.start(time)
        
        this.__target = target
        this.__type.start(this.abil, target)
        this.__actions.get('CAST_START')?.run(this.abil, 'CAST_START', target)
    }

    extraPeriod(reduce_time_left: boolean){
        this.Timer.period(reduce_time_left)
    }

    cancel(){
        this.__stop('CAST_CANCEL')
    }

    interrupt(){
        this.__stop('CAST_INTERRUPT')
    }

    finish(){
        this.__stop('CAST_FINISH')
    }

    castingTime(target: T | undefined){
        return this.__type.castingTime(this.abil, target)
    }

    isTargetValid(target: T){
        return this.__type.isTargetValid(this.abil, target)
    }

    addAction(event: Casting.Event,
              callback: (this: void, abil: IFace<T>, event: Casting.Event, target: T)=>void){
        return this.__actions.get(event)?.add(callback)
    }

    removeAction(action: Utils.Action<[IFace<T>, Casting.Event, T], void> | undefined){
        if (!action){return false}
        for (let [event, list] of this.__actions){
            if (list.remove(action)){return true}
        }
        return false
    }

    private __period(){
        if (!this.__target){
            return Utils.Log.err('target is undefined.',
                                    __path__, Casting, 3)
        }

        this.__actions.get('CAST_CASTING')?.run(this.abil, 'CAST_CASTING', this.__target)
        this.__type.casting(this.abil, this.__target)
    }

    private __stop(event: 'CAST_CANCEL'|'CAST_INTERRUPT'|'CAST_FINISH'){
        if (!this.__target){
            return Utils.Log.err('ability is not casting.',
                                    __path__, Casting, 3)
        }

        if (event == 'CAST_CANCEL'){
            this.__type.cancel(this.abil, this.__target)
        } else if (event == 'CAST_INTERRUPT'){
            this.__type.interrupt(this.abil, this.__target)
        } else {
            this.__type.finish(this.abil, this.__target)
        }
        this.__actions.get(event)?.run(this.abil, event, this.__target)

        if (this.Timer.left > 0){
            this.Timer.cancel()
        }

        this.__target = undefined
        Casting._caster2abil.delete(this.abil.Data.owner)
    }

    readonly abil: IFace<T>
    readonly Timer: Handle.hTimerObj

    private __type: TCasting<T>
    private __target: T | undefined

    private __actions = new Map<Casting.Event, Utils.ActionList<[IFace<T>, Casting.Event, T]>>([
        ['CAST_START', new Utils.ActionList()],
        ['CAST_CASTING', new Utils.ActionList()],
        ['CAST_CANCEL', new Utils.ActionList()],
        ['CAST_INTERRUPT', new Utils.ActionList()],
        ['CAST_FINISH', new Utils.ActionList()],
    ])

    private static _timer_list = new Handle.hTimerList(Casting.period)
    private static _caster2abil = new Map<Handle.hUnit, IFace<TargetType[]>>()
}

export namespace Casting {
    export type Event = 'CAST_START'|'CAST_CASTING'|'CAST_CANCEL'|'CAST_INTERRUPT'|'CAST_FINISH'
}