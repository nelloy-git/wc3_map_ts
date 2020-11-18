type Callback = (this: void, ...args: any[]) => any;

export class Action {
    private static inside = false;
    private callback: Callback;

    constructor(callback: Callback){
        this.callback = callback;
    }

    public run(...args: any[]){
        let res;
        if (!Action.inside) {
            Action.inside = true;
            let success
            [success, res] = pcall(this.callback, ...args);

            if (!success) {
                error(res, 2);
            }

            Action.inside = false;
        }
        else {
            res = this.callback(...args);
        }

        return res;
    }
}