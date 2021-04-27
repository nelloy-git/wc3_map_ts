import { hMultiTimer, hMultiTimerSub } from "../../Handle";
import { EventActions } from "../../Utils";

import type { Buff } from '../Buff'
import type { TDuration } from "./Type";

export class Duration<T> {
    constructor(buff: Buff<T>, type: TDuration<T>){
        this.buff = buff
        this.timer = Duration.__multitimer.add()
        this.timer.actions.add('LOOP', () => {this.__period()})
        this.timer.actions.add('FINISH', () => {this.__stop('FINISH')})
        this.period = Duration.period

        this.actions = new EventActions(this.toString())
        Duration.actions.link()

        this.__type = type
    }

    toString(){
        return this.buff.toString() + '.' + this.constructor.name
    }

    start(time: number){
        if (!this.__type.condition(this.buff)){
            return false
        }

        time = time > 0 ? time : 0.01
        this.timer.start(time)

        this.__type.start(this.buff)
        this.actions.run('START', this)
    }
    
    extraPeriod(reduce_time_left: boolean){
        this.timer.period(reduce_time_left)
    }

    cancel(){
        this.__stop('CANCEL')
    }

    finish(){
        this.__stop('FINISH')
    }

    addStack(base: Buff<T>){
        if (this.buff.Data.stackable(base)){
            this.__type.addStack(this.buff, base)

            if (this.buff.Data.add_duration(base)){
                this.timer.left += base.Dur.timer.left
            } else {
                this.timer.left = math.max(this.timer.left, base.Dur.timer.left)
            }
        }
    }

    destroy(){
        this.timer.destroy()
    }

    private __period(){
        this.__type.period(this.buff)
        this.actions.run('LOOP', this)
    }

    private __stop(event: Exclude<Duration.Event, 'START' | 'LOOP'>){
        if (this.timer.left > this.timer.dt){
            this.timer.stop()
        }

        if (event == 'CANCEL'){
            this.__type.cancel(this.buff)
        } else if (event == 'FINISH') {
            this.__type.finish(this.buff)
        }
        this.actions.run(event, this)
    }
    
    readonly buff: Buff<T>
    readonly actions: EventActions<Duration.Event, [Duration<T>]>
    readonly timer: hMultiTimerSub
    readonly period: number

    private __type: TDuration<T>
    
    static readonly period = 0.05
    private static __multitimer = IsGame() ? new hMultiTimer(Duration.period)
                                           : <hMultiTimer><unknown>undefined
}

export namespace Duration {
    export type Event = 'START' | 'LOOP' | 'CANCEL' | 'FINISH'
    export const actions = new EventActions<Duration.Event,
                                            [Duration<any>]>
                                            (Duration.name)
}