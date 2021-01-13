import { Action, ActionList, Log } from "../../Utils";
import { hTimerList, hTimerObj, hUnit} from '../../Handle'
import { TCasting } from "../Type/Casting";
import { TargetType } from "../Utils";
import { CastingIFace, IFace } from "./IFace";

export class Casting<T extends TargetType> implements CastingIFace<T> {
    constructor(abil: IFace<T>, type: TCasting<T>){
        this.abil = abil
        this._type = type

        this.Timer = Casting._timer_list.newTimerObj()
        this.Timer.addAction('PERIOD', ()=>{this._period()})
        this.Timer.addAction('FINISH', ()=>{this._stop('CAST_FINISH')})
    }

    static getActive(caster: hUnit | undefined){
        if (!caster){return undefined}
        return Casting._caster2abil.get(caster)
    }

    static readonly period = 0.025
    readonly period = Casting.period
    
    start(target: T){
        if (!this.abil.Data.is_available){return false}
        if (!this._type.isTargetValid(this.abil, target)){return false}

        let caster = this.abil.Data.owner

        // Cancel current ability
        let cur = Casting._caster2abil.get(caster)
        if (cur){cur.Casting.cancel()}
        Casting._caster2abil.set(this.abil.Data.owner, this.abil)

        // update charge cooldown
        this.abil.Data.Charges.cooldown = this.abil.Data.charge_cd
        if (!this.abil.Data.consume(target)){
            let t_name = this.abil.Data.name
            return Log.err(Casting.name + 
                           ': error in consuming resources.' + 
                           'Check ' + t_name + '.isAvailable and' +
                           t_name + '.consume methods.')
        }

        let time = this._type.castingTime(this.abil, target)
        time = time > 0 ? time : 0.01
        this.Timer.start(time)
        
        this._target = target
        this._type.start(this.abil, target)
        this._actions.get('CAST_START')?.run(this.abil, 'CAST_START', target)
    }

    extraPeriod(reduce_time_left: boolean){
        this.Timer.period(reduce_time_left)
    }

    cancel(){
        this._stop('CAST_CANCEL')
    }

    interrupt(){
        this._stop('CAST_INTERRUPT')
    }

    finish(){
        this._stop('CAST_FINISH')
    }

    castingTime(target: T | undefined){
        return this._type.castingTime(this.abil, target)
    }

    isTargetValid(target: T){
        return this._type.isTargetValid(this.abil, target)
    }

    addAction(event: Casting.Event,
              callback: (this: void, abil: IFace<T>, event: Casting.Event, target: T)=>void){
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[IFace<T>, Casting.Event, T], void> | undefined){
        if (!action){return false}
        for (let [event, list] of this._actions){
            if (list.remove(action)){return true}
        }
        return false
    }

    private _period(){
        if (!this._target){
            return Log.err(Casting.name + 
                           ': target is undefined.')
        }

        this._actions.get('CAST_CASTING')?.run(this.abil, 'CAST_CASTING', this._target)
        this._type.casting(this.abil, this._target)
    }

    private _stop(event: 'CAST_CANCEL'|'CAST_INTERRUPT'|'CAST_FINISH'){
        if (!this._target){
            return Log.err(Casting.name + 
                           ': ability is not casting.')
        }

        if (event == 'CAST_CANCEL'){
            this._type.cancel(this.abil, this._target)
        } else if (event == 'CAST_INTERRUPT'){
            this._type.interrupt(this.abil, this._target)
        } else {
            this._type.finish(this.abil, this._target)
        }
        this._actions.get(event)?.run(this.abil, event, this._target)

        if (this.Timer.left > 0){
            this.Timer.cancel()
        }

        this._target = undefined
        Casting._caster2abil.delete(this.abil.Data.owner)
    }

    readonly abil: IFace<T>
    readonly Timer: hTimerObj

    private _type: TCasting<T>
    private _target: T | undefined

    private _actions = new Map<Casting.Event, ActionList<[IFace<T>, Casting.Event, T]>>([
        ['CAST_START', new ActionList()],
        ['CAST_CASTING', new ActionList()],
        ['CAST_CANCEL', new ActionList()],
        ['CAST_INTERRUPT', new ActionList()],
        ['CAST_FINISH', new ActionList()],
    ])

    private static _timer_list = new hTimerList(Casting.period)
    private static _caster2abil = new Map<hUnit, IFace<any>>()
}

export namespace Casting {
    export type Event = 'CAST_START'|'CAST_CASTING'|'CAST_CANCEL'|'CAST_INTERRUPT'|'CAST_FINISH'
}