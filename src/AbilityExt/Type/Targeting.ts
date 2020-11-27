import { Action, Log } from '../../Utils'
import { AbilityIface, AbilityTargets } from '../Ability/Iface'

export abstract class Targeting {
    public static cancelCurrent(){
        if (Targeting._current){Targeting._current.cancel()}
        Targeting._current = undefined
    }

    public static isActive(){
        return Targeting._current != undefined
    }

    /* Final function */
    public readonly start = (abil: AbilityIface,
                             callback: (this: void,
                                        abil: AbilityIface,
                                        target: AbilityTargets)=>void): void => {
                                            
        Targeting.cancelCurrent()
        Targeting._current = this
        Targeting._abil = abil
        Targeting._action = new Action(callback)
        this._start()
    }

    /* Final function */
    public readonly cancel = (): void => {
        if (Targeting._current != this){
            Log.err(Targeting.name + 
                    ': can not cancel inactive targeting. ' +
                    'Use static cancelCurrent() instead.', 2)
        }
        Targeting._current = undefined
        this._cancel()
    }

    /** Final function.
        Use 'targets = undefined' for capturing target from subclass. */
    public readonly finish = (targets?: AbilityTargets): void => {
        if (Targeting._current != this){
            Log.err(Targeting.name + 
                    ': can not finish inactive targeting.', 2)
        }

        if (!Targeting._action || ! Targeting._abil){
            return
        }

        Targeting._current = undefined
        targets = this._finish(targets)
        Targeting._action.run(Targeting._abil, targets)
    }

    protected abstract _start(): void
    protected abstract _cancel(): void
    /** 'targets = undefined' should capture targets by itself. */
    protected abstract _finish(targets?: AbilityTargets): AbilityTargets

    protected static get current(){return Targeting._current}
    protected static get ability(){return Targeting._abil}

    private static _current: Targeting | undefined;
    private static _abil: AbilityIface;
    private static _action: Action<[AbilityIface, AbilityTargets], void>;
}