import { EventActions, log } from '../Utils'
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
            for (const sub of this.__sub_timers){
                if (!sub.running){
                    continue
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

    get length(){return this.__sub_timers}

    add(){
        let sub: hMultiTimerSub = new hMultiTimerSubHidden(this)
        this.__sub_timers.push(sub)
        return sub
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
        this.actions = new EventActions(this.toString())

        this.running = false
        this.__start = -1
        this.__end = -1
    }

    toString(){
        return this.owner.toString() + '.' + this.constructor.name
    }

    get left(){return this.__end - this.owner.cur_time}
    set left(time: number){
        if (!this.running){
            log(this.toString() + ': can not get timer time left. Is not running', 'Wrn')
            return
        }
        this.__end = this.owner.cur_time + time
    }

    get dt(){return this.owner.timeout}
    get startTime(){return this.__start}
    get endTime(){return this.__end}
    get fullTime(){return this.__end - this.__start}

    start(timeout: number){
        if (this.running){
            log(this.toString() + ': can not start timer. Already running', 'Wrn')
            return
        }

        (<boolean>this.running) = true
        this.__start = this.owner.cur_time
        this.__end = this.__start + timeout
        this.actions.run('START', this)
    }

    period(is_extra: boolean = false){
        if (!this.running){
            log(this.toString() + ': can not run timer period. Is not running', 'Wrn')
            return
        }

        if (is_extra){
            this.__end -= this.dt
        }

        if (this.owner.cur_time + this.dt >= this.__end){
            this.finish()
        } else {
            this.actions.run('LOOP', this)
        }
    }

    stop(){
        if (!this.running){
            log(this.toString() + ': can not stop timer. Is not running', 'Wrn')
            return
        }

        (<boolean>this.running) = false
        this.actions.run('STOP', this);
    }

    finish(){
        if (!this.running){
            log(this.toString() + ': can finish stop timer. Is not running', 'Wrn')
            return
        }

        (<boolean>this.running) = false
        this.actions.run('FINISH', this);
    }

    destroy(){
        (<boolean>this.running) = false
        this.owner.remove(this)
    }

    pause: boolean = false
    readonly owner: hMultiTimer
    readonly running: boolean

    readonly actions: EventActions<hMultiTimerSub.Event, [mtimer: hMultiTimerSub]>

    private __start: number
    private __end: number
}

export class hMultiTimerSub extends hMultiTimerSubHidden {
    private constructor(owner: hMultiTimer){
        super(owner)
    }
}

export namespace hMultiTimerSub {
    export type Event = 'START' | 'LOOP' | 'STOP' | 'FINISH'
}