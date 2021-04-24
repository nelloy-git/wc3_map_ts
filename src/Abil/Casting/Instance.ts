import { hUnit, hMultiTimer, hMultiTimerSub } from '../../Handle'
import { EventActions } from '../../Utils';

import type { Abil, TargetType } from '../Abil'
import type { TCasting } from './Type'

type NO_TARGET = 'NO_TARGET'

export class Casting<T extends TargetType[]> {
    constructor(abil: Abil<T>, type: TCasting<T>){
        this.abil = abil
        this.period = Casting.period
        this.actions = new EventActions(<Casting<T>>this, this.toString())
        this.timer = Casting.__multitimer.add()
        this.timer.actions.add('LOOP', () => {this.__period()})
        this.timer.actions.add('FINISH', () => {this.__stop('FINISH')})

        this.__type = type
        this.__target = 'NO_TARGET'
    }

    static getActive(caster: hUnit | undefined){
        if (!caster){return undefined}
        return Casting.__caster2abil.get(caster)
    }

    static readonly period = 0.025

    toString(){
        return this.abil.toString() + '.' + Casting.name
    }
    
    start(target: T){
        if (!this.abil.Data.is_available){return false}
        if (!this.__type.isTargetValid(this.abil, target)){return false}

        let caster = this.abil.owner

        // Cancel current ability
        let cur = Casting.__caster2abil.get(caster)
        if (cur){cur.Casting.cancel()}
        Casting.__caster2abil.set(this.abil.owner, this.abil)

        if (!this.abil.Data.consume(target)){
            error(this.toString() +
                  ': error in consuming resources. ' + 
                  'Check "isAvailable" and "consume" ' +
                  'methods of ' + this.abil.Data.name, 2)
        }

        let time = this.__type.castingTime(this.abil, target)
        time = time > 0 ? time : 0.01
        this.timer.start(time)
        
        this.__target = target
        this.__type.start(this.abil, target)
        this.actions.run('START', target)
    }

    extraPeriod(reduce_time_left: boolean){
        this.timer.period(reduce_time_left)
    }

    cancel(){
        this.__stop('CANCEL')
    }

    interrupt(){
        this.__stop('INTERRUPT')
    }

    finish(){
        this.__stop('FINISH')
    }

    destroy(){
        this.timer.destroy()
    }

    private __period(){
        if (this.__target == 'NO_TARGET'){
            error(this.toString() + ': ability is not casting.')
        }

        this.actions.run('LOOP', this.__target)
        this.__type.casting(this.abil, this.__target)
    }

    private __stop(event: Exclude<Casting.Event, 'START' | 'LOOP'>){
        if (this.__target == 'NO_TARGET'){
            error(this.toString() + ': ability is not casting.', 3)
        }

        if (event == 'CANCEL'){
            this.__type.cancel(this.abil, this.__target)
        } else if (event == 'INTERRUPT'){
            this.__type.interrupt(this.abil, this.__target)
        } else {
            this.__type.finish(this.abil, this.__target)
        }
        this.actions.run(event, this.__target)

        if (this.timer.left > 0){
            this.timer.stop()
        }

        this.__target = 'NO_TARGET'
        Casting.__caster2abil.delete(this.abil.owner)
    }

    readonly abil: Abil<T>
    readonly period: number
    readonly timer: hMultiTimerSub
    readonly actions: EventActions<Casting.Event, Casting<T>, [T]>

    private __type: TCasting<T>
    private __target: T | NO_TARGET

    private static __multitimer = IsGame() ? new hMultiTimer(Casting.period)
                                           : <hMultiTimer><unknown>undefined
    private static __caster2abil = new Map<hUnit, Abil<any>>()
}

export namespace Casting {
    export type Event = 'START' | 'LOOP' | 'CANCEL' | 'INTERRUPT' | 'FINISH'
}