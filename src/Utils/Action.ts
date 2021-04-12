import { Logger } from './Logger'
let Log = Logger.Default

export class Action<In extends any[], Out> {

    constructor(callback: (this:void, ...args: In) => Out, header?: string){
        this.__callback = callback
        this.__header = header ? header + ': ' : ''
    }

    run(...args: In): Out | undefined{
        let res
        if (!Action.__inside_xpcall) {
            Action.__inside_xpcall = true
            let success
            [success, res] = xpcall(this.__callback, (err) => {
                Log.wrn(this.__header + err)
            }, ...args)

            Action.__inside_xpcall = false
        } else {
            res = this.__callback(...args)
        }

        return res as Out | undefined
    }

    private __callback: (this:void, ...args: In) => Out
    private __header: string
    
    private static __inside_xpcall = false
}