import { TargetType } from "../../AbilityExt/Ability/IFace";
import { hTimerList, hTimerObj } from "../../Handle";
import { Action, ActionList } from "../../Utils";
import { TDuration } from "../Type/Duration";
import { IFace, DurationIFace } from "./IFace";

export class Duration<T> implements DurationIFace<T> {
    constructor(buff: IFace<T>, type: TDuration<T>){
        this.buff = buff
        this.__type = type

        this.Timer = Duration.__timer_list.newTimerObj()
        this.Timer.addAction('PERIOD', () => {this._period()})
        this.Timer.addAction('FINISH', () => {this._stop('FINISH')})
    }
    
    static readonly period = 0.05
    readonly period = Duration.period

    start(time: number){
        if (!this.__type.condition(this.buff)){return false}

        time = time > 0 ? time : 0.01
        this.Timer.start(time)

        this.__type.start(this.buff)
        this.__actions.get('START')?.run(this.buff, 'START')
    }
    
    extraPeriod(reduce_time_left: boolean){
        this.Timer.period(reduce_time_left)
    }

    cancel(){
        this._stop('CANCEL')
    }

    finish(){
        this._stop('FINISH')
    }

    addStack(other: IFace<T>){
        if (this.buff.Data.stackable){
            this.__type.addStack(this.buff, other)

            if (this.buff.Data.add_duration){
                this.Timer.left += other.Dur.Timer.left
            } else {
                this.Timer.left = math.max(this.Timer.left, other.Dur.Timer.left)
            }
        }
    }

    addAction(event: Duration.Event,
              callback: (this: void, buff: IFace<T>, event: Duration.Event) => void){
        return this.__actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[IFace<T>, Duration.Event], void> | undefined){
        for (let [event, list] of this.__actions){
            if (list.remove(action)){return true}
        }
        return false
    }

    private _period(){
        this.__type.period(this.buff)
        this.__actions.get('PERIOD')?.run(this.buff, 'PERIOD')
    }

    private _stop(event: 'CANCEL'|'FINISH'){
        if (this.Timer.left > 0){
            this.Timer.cancel()
        }

        if (event == 'CANCEL'){
            this.__type.cancel(this.buff)
        } else {
            this.__type.finish(this.buff)
        }
        this.__actions.get(event)?.run(this.buff, event)
    }
    
    readonly buff: IFace<T>
    readonly Timer: hTimerObj

    private __type: TDuration<T>
    private __actions = new Map<Duration.Event, ActionList<[IFace<any>, Duration.Event]>>([
        ['START', new ActionList()],
        ['PERIOD', new ActionList()],
        ['CANCEL', new ActionList()],
        ['FINISH', new ActionList()],
    ])
    
    private static __timer_list = new hTimerList(Duration.period)
}

export namespace Duration {
    export type Event = 'START'|'PERIOD'|'CANCEL'|'FINISH'
}