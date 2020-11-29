import { TimerObj, Unit } from "../../Handle";
import { Action, ActionList } from "../../Utils";
import { Type } from "../Type";

import { AbilityIface, AbilityEvent, AbilityTargets } from './Iface'
import { AbilityTargeting } from "./Targeting";

export abstract class AbilitySynced extends AbilityTargeting{
    constructor(owner: Unit, type: Type){
        super(owner, type)

        this._casting = new TimerObj()
        this._casting.addAction('PERIOD', ():void => {this._castingPeriod()})
        this._casting.addAction('FINISH', ():void => {this._castingFinish()})
    }

    public get targets(){return this._targets}

    public castingPeriod(){
        this._casting.period(true)
    }

    public castingCancel(){
        this._casting.cancel()
        this.type.casting.cancel(this)
        this._actions.get('CANCEL')?.run(this, 'CANCEL')
        this._targets = undefined
    }

    public castingInterrupt(){
        this._casting.cancel()
        this.type.casting.interrupt(this)
        this._actions.get('INTERRUPT')?.run(this, 'INTERRUPT')
        this._targets = undefined
    }

    public castingFinish(){
        this._casting.finish()
    }

    public addAction(event: AbilityEvent,
                     callback: (this: void,
                                abil: AbilityIface,
                                event: AbilityEvent)=>void) {
        return this._actions.get(event)?.add(callback)
    }

    public removeAction(action: Action<[AbilityIface, AbilityEvent], void>){
        let found = false
        for (let [event, list] of this._actions){
            found = list.remove(action)
            if(found){break}
        }
        return found
    }

    protected _receivedTargets(targets: AbilityTargets){
        if (!(this.type.data.isAvailable(this) &&
              this.type.data.areTargetsValid(this, targets))){return false}

        this._targets = targets
        this._casting.start(this.type.data.castingTime(this))

        this.type.data.consume(this)
        this.type.casting.start(this)
        this._actions.get('START')?.run(this, 'START')

        return true
    }

    protected _castingPeriod(){
        this.type.casting.casting(this)
        this._actions.get('CASTING')?.run(this, 'CASTING')
    }

    protected _castingFinish(){
        this.type.casting.finish(this)
        this._actions.get('FINISH')?.run(this, 'FINISH')
        this._targets = undefined
    }

    protected _targets: AbilityTargets | undefined;
    protected _casting: TimerObj;

    private _actions = new Map<AbilityEvent, ActionList<[AbilityIface, AbilityEvent]>>([
        ['START', new ActionList()],
        ['CASTING', new ActionList()],
        ['CANCEL', new ActionList()],
        ['INTERRUPT', new ActionList()],
        ['FINISH', new ActionList()],
    ])
}