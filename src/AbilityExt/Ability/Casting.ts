import { Action, ActionList, Log } from "../../Utils";
import { hTimerList, hTimerObj} from '../../Handle'
import { TCasting } from "../Type/Casting";
import { TargetType } from "../Utils";
import { CastingIFace, IFace } from "./IFace";

export class Casting<T extends TargetType> implements CastingIFace<T> {
    constructor(abil: IFace<T>, type: TCasting<T>){
        this.abil = abil
        this._type = type

        this.timer = Casting._timer_list.newTimerObj()
        this.timer.addAction('PERIOD', ()=>{this._period()})
        this.timer.addAction('FINISH', ()=>{this._stop('CAST_FINISH')})
    }

    static readonly period = 0.05
    readonly period = Casting.period
    
    start(target: T){
        if (!this.abil.Data.is_available){return false}
        if (!this._type.isTargetValid(this.abil, target)){return false}

        if (!this.abil.Data.consume(target)){
            let t_name = this.abil.Data.name
            return Log.err(Casting.name + 
                           ': error in consuming resources.' + 
                           'Check ' + t_name + '.isAvailable and' +
                           t_name + '.consume methods.')
        }

        this.timer.start(this.abil.Data.casting_time)
        
        this._target = target
        this._type.start(this.abil, target)
        this._actions.get('CAST_START')?.run(this.abil, 'CAST_START', target)
    }

    extraPeriod(reduce_time_left: boolean){
        this.timer.period(reduce_time_left)
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

    addAction(event: Casting.Event,
              callback: (this: void, abil: IFace<T>, event: Casting.Event, target: T)=>void){
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[IFace<T>, Casting.Event, T], void>){
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

        this._type.casting(this.abil, this._target)
        this._actions.get('CAST_CASTING')?.run(this.abil, 'CAST_CASTING', this._target)
    }

    private _stop(event: 'CAST_CANCEL'|'CAST_INTERRUPT'|'CAST_FINISH'){
        if (!this._target){
            return Log.err(Casting.name + 
                           ': ability is not casting.')
        }

        if (this.timer.left > 0){
            this.timer.cancel()
        }

        if (event == 'CAST_CANCEL'){
            this._type.cancel(this.abil, this._target)
        } else if (event == 'CAST_INTERRUPT'){
            this._type.interrupt(this.abil, this._target)
        } else {
            this._type.finish(this.abil, this._target)
        }
        this._actions.get(event)?.run(this.abil, event, this._target)
        this._target = undefined
    }

    readonly abil: IFace<T>
    readonly timer: hTimerObj

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
}

export namespace Casting {
    export type Event = 'CAST_START'|'CAST_CASTING'|'CAST_CANCEL'|'CAST_INTERRUPT'|'CAST_FINISH'
}