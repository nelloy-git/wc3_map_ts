import { hMultiTimer, hMultiTimerSub } from '../../Handle'
import { EventActions } from '../../Utils'

import type { Abil, TargetType } from '../Abil'
import type { TCharges } from './Type'

export class Charges<T extends TargetType[]> {
    constructor(abil: Abil<T>, type: TCharges<T>){
        this.abil = abil
        this.period = Charges.period
        this.actions = new EventActions(this.toString())

        this.__type = type
        this.__count = 1
        this.__count_max = 1
        this.__timer = Charges.__multitimer.add()
        this.__timer.actions.add('FINISH', () => {this.cur++})
        this.__timer.actions.add('LOOP', () => {this.actions.run('LOOP', this.abil)})

        this.update()
    }

    toString(){
        return this.abil.toString() + '.' + this.constructor.name
    }

    get cur(){return this.__count}
    set cur(count: number){
        count = count < 0 ? 0 : count
        count = count > this.__count_max ? this.__count_max : count
        let added = count > this.__count
        let removed = count < this.__count
        this.__count = count

        this.update()
        if (added){
            this.actions.run('ADDED', this.abil)
        } else if (removed){
            this.actions.run('REMOVED', this.abil)
        }
    }

    get left_cd(){return this.__timer.left}
    set left_cd(t: number){this.__timer.left = t}

    get pause(){return this.__timer.pause}
    set pause(f: boolean){this.__timer.pause = f}

    get use(){return this.__type.use(this.abil)}
    get max(){return this.__type.max(this.abil)}
    get cd(){return this.__type.cd(this.abil)}

    consume(){
        this.cur -= this.__type.use(this.abil)
    }

    update(){
        this.__count_max = this.__type.max(this.abil)
        if (this.__count < this.__count_max){
            if (this.__timer.left < 0){
                this.__timer.start(this.__type.cd(this.abil))
            }
        } else {
            if (this.__timer.running){
                this.__timer.stop()
            }
        }
    }

    destroy(){
        this.__timer.destroy()
    }

    readonly abil: Abil<T>
    readonly period: number
    readonly actions: EventActions<Charges.Event, [Abil<T>]>

    private __type: TCharges<T>
    private __count: number
    private __count_max: number
    private __timer: hMultiTimerSub

    static readonly period = 0.1
    private static __multitimer = IsGame() ? new hMultiTimer(Charges.period)
                                           : <hMultiTimer><unknown>undefined
}

export namespace Charges {
    export type Event = 'ADDED' | 'REMOVED' | 'LOOP'
}