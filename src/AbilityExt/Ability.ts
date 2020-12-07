import { hTimerList, hUnit } from '../Handle'
import { Action, ActionList, Log } from "../Utils";

import { AbilityBase } from './Ability/Base'
import { Charges } from './Charges'
import { Point } from './Point';
import { Type } from './Type'

export class Ability<TargType extends AbilityBase.TargType> implements AbilityBase<TargType> {
    constructor(owner: hUnit, type: Type<TargType>){
        this.owner = owner
        this.type = type
        this.id = AbilityBase.register(this)

        this.charges.addAction('COUNT_CHANGED', ()=>{this._updateCharges()})
        this._updateCharges()

        let dt = Ability._timer_list.period
        this._casting.addAction('PERIOD', ():void => {this._castingPeriod(dt)})
        this._casting.addAction('FINISH', ():void => {this._castingFinish()})
    }
    static getUnitCasts(u: hUnit){
        let cur = Ability._active_castings.get(u)
        if (!cur){cur = []}
        return cur
    }

    readonly owner: hUnit;
    readonly id: number;
    readonly type: Type<TargType>;

    targetingStart(pl: jplayer){
        if (this.type.data.isAvailable(this)){
            this.type.targeting.start(pl, this)
            return true
        }
        return false
    }

    targetingCancel(pl: jplayer){
        this.type.targeting.cancel(pl)
    }

    targetingFinish(pl: jplayer, targets?: TargType){
        this.type.targeting.finish(pl, targets)
    }

    getTargets(){return this._targets}
    static getActiveCasting(owner: hUnit){

    }

    castingStart(targets: TargType){
        if (this.type.data.isAvailable(this) &&
            this.type.data.areTargetsValid(this, targets)){

            this._targets = targets

            if (!this.type.data.consume(this)){
                let t_name = this.type.data.name(this)
                return Log.err(Ability.name + 
                               ': error in consuming resources.' + 
                               'Check ' + t_name + '.isAvailable and' +
                               t_name + '.consume methods.')
            }
            this.type.casting.start(this)
            this._casting.start(this.type.data.castingTime(this))
            this._actions.get('START')?.run(this, 'START')

            Ability._regCasting(this.owner, this)
            return true
        }
        return false
    }

    castingPeriod(){
        this._casting.period(true)
    }

    castingCancel(){
        this._casting.cancel()
        this.type.casting.cancel(this)
        this._actions.get('CANCEL')?.run(this, 'CANCEL')
        this._targets = undefined
        Ability._delCasting(this.owner, this)
    }

    castingInterrupt(){
        this._casting.cancel()
        this.type.casting.interrupt(this)
        this._actions.get('INTERRUPT')?.run(this, 'INTERRUPT')
        this._targets = undefined
        Ability._delCasting(this.owner, this)
    }

    castingFinish(){
        this._casting.finish()
        Ability._delCasting(this.owner, this)
    }

    addAction(event: Ability.Event,
              callback: (this: void,
                         abil: AbilityBase<TargType>,
                         event: Ability.Event)=>void) {
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[AbilityBase<TargType>, Ability.Event], void> | undefined){
        if (!action){return false}

        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if(found){break}
        }
        return found
    }

    private _castingPeriod(dt: number){
        this.type.casting.casting(this, dt)
        this._actions.get('CASTING')?.run(this, 'CASTING')
    }

    private _castingFinish(){
        this.type.casting.finish(this)
        this._actions.get('FINISH')?.run(this, 'FINISH')
        this._targets = undefined
    }

    private _updateCharges(){
        this.charges.cooldown = this.type.data.chargeCooldown(this)
        this.charges.countMax = this.type.data.chargeMax(this)
    }

    private _actions = new Map<Ability.Event, ActionList<[AbilityBase<TargType>, Ability.Event]>>([
        ['START', new ActionList()],
        ['CASTING', new ActionList()],
        ['CANCEL', new ActionList()],
        ['INTERRUPT', new ActionList()],
        ['FINISH', new ActionList()],
    ])

    readonly charges = new Charges();
    private _targets: TargType | undefined;
    private _casting = Ability._timer_list.newTimerObj();

    private static _last_id = 0
    private static newId(){
        Ability._last_id += 1
        return Ability._last_id
    }
    private static _timer_list = new hTimerList(0.05)

    private static _active_castings = new Map<hUnit, Ability<any>[]>()
    private static _regCasting(caster: hUnit, abil:Ability<any>){
        let cur = Ability._active_castings.get(caster)
        if (!cur){cur = []}
        cur.push(abil)
        Ability._active_castings.set(caster, cur)
    }

    private static _delCasting(caster: hUnit, abil:Ability<any>){
        let cur = Ability._active_castings.get(caster)
        if (!cur){return false}

        let pos = cur.indexOf(abil)
        if (pos < 0){return false}
        cur.splice(pos, 1)
        Ability._active_castings.set(caster, cur)
        return true
    }
}

export namespace Ability {
    export type Event = AbilityBase.Event
}

let u = (null as unknown) as hUnit
let type = (null as unknown) as Type<Point>

let abil = new Ability<Point>(u, type)