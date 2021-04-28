import { hMultiTimer, hMultiTimerSub } from "../../Handle";
import { EventActions } from "../../Utils";

import type { Buff } from '../Buff'
import type { TDuration } from "./Type";

export class Duration<T> {
    constructor(buff: Buff<T>, type: TDuration<T>){
        this.buff = buff
        this.__timer = Duration.__multitimer.add()
        this.__timer.actions.add('LOOP', () => {this.__period()})
        this.__timer.actions.add('FINISH', () => {this.__stop('FINISH')})
        this.period = Duration.period

        this.actions = new EventActions(this.toString())
        this.actions.link(Duration.__global_event_map, Duration.actions)

        this.__type = type
    }

    toString(){
        return this.buff.toString() + '.' + this.constructor.name
    }

    start(time: number){
        if (!this.__type.condition(this.buff)){
            this.actions.run('FAIL', this)
            return false
        }

        time = time > 0 ? time : 0.01
        this.__timer.start(time)

        this.__type.start(this.buff)
        this.actions.run('START', this)
        return true
    }
    
    extraPeriod(reduce_time_left: boolean){
        this.__timer.period(reduce_time_left)
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
                this.__timer.left += base.Dur.__timer.left
            } else {
                this.__timer.left = math.max(this.__timer.left, base.Dur.__timer.left)
            }
        }
    }

    destroy(){
        this.actions.destroy()
        this.__timer.destroy()
    }

    private __period(){
        this.__type.period(this.buff)
        this.actions.run('LOOP', this)
    }

    private __stop(event: Exclude<Duration.Event, 'START' | 'LOOP'>){
        if (this.__timer.left > this.__timer.dt){
            this.__timer.stop()
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
    readonly period: number

    private readonly __type: TDuration<T>
    private readonly __timer: hMultiTimerSub
    
    static readonly period = 0.05
    private static __multitimer = IsGame() ? new hMultiTimer(Duration.period)
                                           : <hMultiTimer><unknown>undefined
                                           
    private static __global_event_map = new Map<Buff.Event, Buff.Event>([
        ['START', 'START'],
        ['FAIL', 'FAIL'],
        ['LOOP', 'LOOP'],
        ['CANCEL', 'CANCEL'],
        ['FINISH', 'FINISH'],
    ])
}

export namespace Duration {
    export type Event = 'START' | 'FAIL' | 'LOOP' | 'CANCEL' | 'FINISH'
    export const actions = new EventActions<Duration.Event,
                                            [Duration<any>]>
                                            (Duration.name)
}