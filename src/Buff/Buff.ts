import { hMultiTimer, hMultiTimerSub, hUnit } from "../Handle";
import { EventActions, log } from "../Utils";
import { TData } from "./TData";
import { TDuration } from "./TDuration";

import type { TBuff } from './TBuff'

export class Buff<T> {

    constructor(owner: hUnit, type: TBuff<T>, userdata: T){
        this.id = Buff.__register(this)
        this.owner = owner
        this.type = type
        this.userdata = userdata
        this.__Data = type.TData
        this.__Dur = type.TDuration
        this.__timer = Buff.__multitimer.add()

        this.actions = new EventActions(this.toString())
        this.actions.link(Buff.__global_event_map, Buff.actions)

        this.__timer.actions.add('LOOP', () => {this.period()})
        this.__timer.actions.add('STOP', () => {this.cancel()})
        this.__timer.actions.add('FINISH', () => {this.finish()})

        this.actions.run('NEW', this)
    }

    toString(){
        return this.constructor.name + '<' + this.__Data.name(this) + ':' + this.id.toString() + '>'
    }

    start(dur: number){
        if (this.__timer.running){
            log(this.toString() + ': can not start buff. Already started.')
            return false
        }

        let success = this.__Dur.condition(this)
        if (success){
            this.__timer.start(dur)
            this.actions.run('START', this)
        } else {
            this.actions.run('FAIL', this)
        }
        return success
    }

    period(){
        this.__Dur.period(this)
        this.actions.run('LOOP', this)
    }

    cancel(){
        // Called from outside, so timer should run this function 1 more time
        if (this.__timer.running){
            this.__timer.stop()
            return
        }

        this.__Dur.cancel(this)
        this.actions.run('CANCEL', this)
        this.destroy()
    }

    finish(){
        // Called from outside, so timer should run this function 1 more time
        if (this.__timer.running){
            this.__timer.stop()
            return
        }

        this.__Dur.finish(this)
        this.actions.run('FINISH', this)
        this.destroy()
    }

    destroy(){
        this.actions.run('DESTROY', this)
        this.__timer.destroy()
        Buff.__id2buff.delete(this.id);
    }

    readonly id: number
    readonly owner: hUnit
    readonly type: TBuff<T>
    get left(){return this.__timer.left}
    get full(){return this.__timer.fullTime}
    userdata: T
    readonly actions: EventActions<Buff.Event, [Buff<T>]>

    private readonly __timer: hMultiTimerSub
    private readonly __Data: TData<T>
    private readonly __Dur: TDuration<T>

    private static __id2buff = new Map<number, Buff<any>>()
    private static __last_id = 0
    private static __register(buff: Buff<any>){
        Buff.__last_id++
        Buff.__id2buff.set(this.__last_id, buff)
        return Buff.__last_id
    }

    private static readonly __multitimer = IsGame() ? new hMultiTimer(0.05)
                                                    : <hMultiTimer><unknown>undefined
    private static readonly __global_event_map: ReadonlyMap<Buff.Event, Buff.Event> = new Map([
        ['NEW', 'NEW'],
        ['DESTROY', 'DESTROY'],
        ['START', 'START'],
        ['FAIL', 'FAIL'],
        ['LOOP', 'LOOP'],
        ['CANCEL', 'CANCEL'],
        ['FINISH', 'FINISH'],
    ])
}

export namespace Buff {
    export type Event =  'NEW' | 'DESTROY' | 'START' | 'FAIL' | 'LOOP' | 'CANCEL' | 'FINISH'
    
    export const actions = new EventActions<Buff.Event,
                                            [Buff<any>]>
                                            (Buff.name)
}