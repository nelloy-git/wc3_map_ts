import { log } from '../Log'

export class Action<Args extends any[] = [], Out = void> {

    constructor(callback: (this: void, ...args: Args) => Out,
                header?: string){
        this.header = header ? header : '<Empty>'
        this.__callback = callback
    }

    toString(){
        return this.header + '.' + this.constructor.name
    }

    run(...args: Args): Out{
        let res
        if (!Action.__inside_xpcall) {
            Action.__inside_xpcall = true
            let success
            [success, res] = xpcall(this.__callback, (err) => {
                log(this.toString + ' ' + err, 'Err')
            }, ...args)

            Action.__inside_xpcall = false
        } else {
            res = this.__callback(...args)
        }

        return res as Out
    }
    
    destroy(){
        (<any>this.__callback) = undefined
    }

    readonly header: string
    private __callback: (this: void, ...args: Args) => Out
    
    private static __inside_xpcall = false
}