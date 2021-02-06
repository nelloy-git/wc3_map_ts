import { Logger } from './Logger'
import { getFilePath } from './Funcs'
let Log = Logger.Default

let __path__ = Macro(getFilePath())

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

            if (!success) {
                return Log.err(<string>res,
                                __path__, Action, 2);
            }

            Action.inside = false;
        }
        else {
            res = this._callback(...args);
        }

        return (res as Out);
    }
    
    private static inside = false;

    private _callback: (this:void, ...args: In)=>Out;
}