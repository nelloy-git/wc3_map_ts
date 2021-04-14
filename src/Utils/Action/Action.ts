import { Logger } from '../Logger'
let Log = Logger.Default

export class Action<Owner = void, Args extends any[] = [], Out = void> {

    constructor(owner: Owner,
                callback: (this: void, owner: Owner, ...args: Args) => Out,
                err_header?: string){
        this.owner = owner
        this.__callback = callback
        this.err_header = err_header ? err_header + ': ' : ''
    }

    run(...args: Args): Out{
        let res
        if (!Action.__inside_xpcall) {
            Action.__inside_xpcall = true
            let success
            [success, res] = xpcall(this.__callback, (err) => {

                Log.wrn(this.err_header + err)
            }, this.owner, ...args)

            Action.__inside_xpcall = false
        } else {
            res = this.__callback(this.owner, ...args)
        }

        return res as Out
    }

    readonly owner: Owner
    readonly err_header: string
    private __callback: (this: void, owner: Owner, ...args: Args) => Out
    
    private static __inside_xpcall = false
}