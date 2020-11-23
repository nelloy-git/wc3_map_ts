/** @noSelfInFile */
import { Logger } from './Logger'
let Log = Logger.Default

export class Action<In extends any[], Out> {

    constructor(callback: (this:void, ...args: In)=>Out){
        this._callback = callback;
    }

    public run(...args: In): Out{
        let res;
        if (!Action.inside) {
            Action.inside = true;
            let success
            [success, res] = pcall(this._callback, ...args);

            if (typeof res === 'string') {
                return Log.err(Action.toString() + ': ' + res, 2);
            }

            Action.inside = false;
        }
        else {
            res = this._callback(...args);
        }

        return res;
    }
    
    private static inside = false;

    private _callback: (this:void, ...args: In)=>Out;
}