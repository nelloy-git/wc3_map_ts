import { TimerList, Unit } from '../Handle'
import { Action, ActionList, Log } from "../Utils";

import { AbilityBase, Targets, Event } from './Ability/Base'
import { Charges } from './Charges'
import { Type } from './Type'

export class Ability implements AbilityBase {
    constructor(owner: Unit, type: Type){
        this.owner = owner
        this.type = type
        this.id = AbilityBase.register(this)

        this.charges.addAction('COUNT_CHANGED', ()=>{this._updateCharges()})
        this._updateCharges()

        this._casting.addAction('PERIOD', ():void => {this._castingPeriod()})
        this._casting.addAction('FINISH', ():void => {this._castingFinish()})
    }
    static get = AbilityBase.get

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

    targetingFinish(pl: jplayer, targets?: Targets){
        this.type.targeting.finish(pl, targets)
    }

    getTargets(){return this._targets}

    castingStart(targets: Targets){
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
    }

    castingInterrupt(){
        this._casting.cancel()
        this.type.casting.interrupt(this)
        this._actions.get('INTERRUPT')?.run(this, 'INTERRUPT')
        this._targets = undefined
    }

    castingFinish(){
        this._casting.finish()
    }

    addAction(event: Event,
              callback: (this: void,
                         abil: AbilityBase,
                         event: Event)=>void) {
        return this._actions.get(event)?.add(callback)
    }

    removeAction(action: Action<[AbilityBase, Event], void>){
        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if(found){break}
        }
        return found
    }

    readonly owner: Unit;
    readonly id: number;
    readonly type: Type;

    private _castingPeriod(){
        this.type.casting.casting(this)
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


    private _actions = new Map<Event, ActionList<[AbilityBase, Event]>>([
        ['START', new ActionList()],
        ['CASTING', new ActionList()],
        ['CANCEL', new ActionList()],
        ['INTERRUPT', new ActionList()],
        ['FINISH', new ActionList()],
    ])

    readonly charges = new Charges();
    private _targets: Targets | undefined;
    private _casting = Ability._timer_list.newTimerObj();

    private static _last_id = 0
    private static newId(){
        Ability._last_id += 1
        return Ability._last_id
    }
    private static _timer_list = new TimerList(0.05, 0.025)
}