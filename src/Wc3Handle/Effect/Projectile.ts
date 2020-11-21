import { Action, ActionList, Log } from "../../Wc3Utils/index";
import { Effect } from '../Effect';
import { Timer } from '../Timer'

type ProjectileEvent = 'LOOP'|'FINISH'

export class Projectile extends Effect {
    constructor(model: string, x: number, y:number, z: number){
        super(model, x, y, z)
        this._timer_action = Projectile._timer?.addAction(
            (timer: Timer): void => {this.loop()}
        )
    }

    public get target(){return this._target}
    public set target(targ: [x: number, y: number]){
        this._target = targ

        let [targ_x, targ_y] = targ
        let dx = this.x - targ_x
        let dy = this.y - targ_y
        this.yaw = math.atan2(dy, dx)

        let r = math.sqrt(dx * dx + dy * dy)
        this._vel_x = Projectile._update_period * this._vel * dx / r
        this._vel_y = Projectile._update_period * this._vel * dy / r
    }

    public get velocity(){return this._vel}
    public set velocity(vel: number){
        let k = vel / this._vel

        let prev = this._vel
        this._vel = vel
        if (prev == 0){
            this.target = this._target
            return
        }

        this._vel_x = k * this._vel_x
        this._vel_y = k * this._vel_y
    }

    public addAction(event: ProjectileEvent,
                     callback: (this: void, proj: Projectile, event: ProjectileEvent)=>void){
        return this._actions.get(event)?.add(callback)
    }

    public removeAction(action: Action<[Projectile, ProjectileEvent], void>){
        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if (found){break}
        }
        return found
    }

    public destroy(){
        Projectile._timer?.removeAction(this._timer_action)
        super.destroy()
    }

    private loop(){
        this.x += this._vel_x
        this.y += this._vel_y

        let [targ_x, targ_y] = this._target
        let dx = this.x - targ_x
        dx = dx > 0 ? dx : -dx
        let dy = this.y - targ_y
        dy = dy > 0 ? dy : -dy

        let a_vel_x = this._vel_x > 0 ? this._vel_x : -this._vel_x
        let a_vel_y = this._vel_y > 0 ? this._vel_y : -this._vel_y

        if (dx <= a_vel_x && dy <= a_vel_y){
            this._actions.get('FINISH')?.run(this, 'FINISH')
        } else {
            this._actions.get('LOOP')?.run(this, 'LOOP')
        }
    }

    private _target: [x: number, y: number] = [0, 0]
    private _vel = 0
    private _vel_x = 0
    private _vel_y = 0
    private _timer_action;
    private _actions = new Map<ProjectileEvent, ActionList<[Projectile, ProjectileEvent]>>([
        ['LOOP', new ActionList()],
        ['FINISH', new ActionList()]
    ])
    
    private static createTimer(period: number){
        let timer = new Timer()
        timer.start(period, true)
        return timer
    }

    private static _update_period = 0.05
    private static _timer = IsGame() ? Projectile.createTimer(Projectile._update_period) : undefined
}