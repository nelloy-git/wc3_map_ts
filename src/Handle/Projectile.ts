
import { Vec3 } from "../Math";
import { Action, EventActions } from "../Utils";
import { hEffect } from './Effect';
import { hTimer } from './Timer'

export class hProjectile extends hEffect {
    constructor(model: string){
        super(model)
        
        this.actions = new EventActions(this.toString())

        this.__target = new Vec3(0, 0, 0)
        this.__vel = new Vec3(0, 0, 0)
        this.__vel_len = 0
        this.__timer_action = hProjectile.__timer.actions.add(() => {
            this.__loop()
        })
    }

    static get period(){return hProjectile.__period}
    static set period(dt: number){
        hProjectile.__period = dt
        hProjectile.__timer.start(dt, true)
    }

    set pos(v: Vec3){
        this.__pos = v.copy()
        BlzSetSpecialEffectPosition(this.handle, v.x,
                                                 v.y,
                                                 this.__visible ? v.z : -10000)
        this.__updVel()
    }

    get target(){return this.__target.copy()}
    set target(v: Vec3){
        this.__target = v.copy()
        this.__updVel()
    }

    get vel(){return this.__vel_len}
    set vel(vel: number){
        this.__vel_len = vel
        this.__updVel()
    }

    destroy(){
        hProjectile.__timer.actions.remove(this.__timer_action)
        super.destroy()
    }

    private __loop(){
        this.pos = this.pos.add(this.__vel)

        let range = this.__target.sub(this.pos).length
        if (range > this.__vel_len){
            this.actions.run('LOOP', this, hProjectile.__period)
        } else {
            this.actions.run('DONE', this, hProjectile.__period)
            this.destroy()
        }
    }

    private __updVel(){
        let norm = this.__target.sub(this.pos).norm
        this.__vel = norm.mult(hProjectile.__period * this.__vel_len)
    }

    readonly actions: EventActions<hProjectile.Event, [proj: hProjectile, dt: number]>

    private __target: Vec3
    private __vel: Vec3
    private __vel_len: number
    private __timer_action: Action<[hTimer]>

    private static __period = 0.05
    private static __timer = IsGame() ? (() => {
        let timer = new hTimer()
        timer.start(hProjectile.__period, true)
        return timer
    })() : <hTimer><unknown>undefined
}

export namespace hProjectile {
    export type Event = 'LOOP' | 'DONE'
}