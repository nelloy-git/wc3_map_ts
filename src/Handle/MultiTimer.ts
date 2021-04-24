import { EventActions } from '../Utils'
import { hTimer } from './Timer'

export class hMultiTimer extends hTimer {
    constructor(period: number, start_delay: number = period * math.random()){
        super()

        this.cur_time = 0
        this.__sub_timers = []

        let delay = new hTimer()
        delay.actions.add(() => {
            this.start(period, true)       
            delay.destroy()
        })
        delay.start(start_delay, false)

        this.actions.add(() => {
            const t = this.cur_time
            for (const sub of this.__sub_timers){
                if (t > sub.endTime){
                    break
                }

                if (sub.pause){
                    sub.left += this.timeout
                } else {
                    sub.period()
                }
            }

            (<number>this.cur_time) += period
        })
    }

    add(){
        return new hMultiTimerSubHidden(this) as hMultiTimerSub
    }

    remove(sub: hMultiTimerSub){
        let pos = this.__sub_timers.indexOf(sub)
        if (pos >= 0){
            this.__sub_timers.splice(pos, 1)
        }
        return pos >= 0
    }

    readonly cur_time: number

    private __sub_timers: hMultiTimerSub[]
}

class hMultiTimerSubHidden {
    constructor(owner: hMultiTimer){
        this.owner = owner
        this.actions = new EventActions(<hMultiTimerSubHidden>this,
                                         hMultiTimerSubHidden.name + ':' + tostring(owner.id))

        this.__start = -1
        this.__end = -1
        this.__dt = owner.timeout
    }

    get left(){return this.__end - this.owner.cur_time}
    set left(time: number){
        if (this.__start > 0){
            this.__end = this.owner.cur_time + time
        }
    }

    get startTime(){return this.__start}
    get endTime(){return this.__end}
    get fullTime(){return this.__end - this.__start}

    start(timeout: number){
        this.__start = this.owner.cur_time
        this.__end = this.__start + timeout
        this.actions.run('START', this.__dt)
    }

    period(is_extra: boolean = false){
        if (is_extra){
            this.__end -= this.__dt
        }

        if (this.left < this.__dt){
            this.finish()
        } else {
            this.actions.run('LOOP', this.__dt)
        }
    }

    stop(){
        this.actions.run('STOP', this.__dt)
        this.__start = -1
        this.__end = -1
    }

    finish(){
        this.actions.run('FINISH', this.__dt)
        this.__start = -1
        this.__end = -1
    }

    destroy(){
        this.owner.remove(this)
    }

    pause: boolean = false
    readonly owner: hMultiTimer
    readonly actions: EventActions<hMultiTimerSub.Event, hMultiTimerSub, [dt: number]>

    private __start: number
    private __end: number
    private __dt: number
}

export class hMultiTimerSub extends hMultiTimerSubHidden {
    private constructor(owner: hMultiTimer){
        super(owner)
    }
}

export namespace hMultiTimerSub {
    export type Event = 'START' | 'LOOP' | 'STOP' | 'FINISH'
}