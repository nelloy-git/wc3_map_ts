import { SimpleStatusBar } from "../../FrameExt";
import { hTimerList } from "../../Handle";
import { Action, float2str } from "../../Utils";

export class InterfaceAutoBar extends SimpleStatusBar {
    constructor(){
        super()
        
        this._timer_obj = InterfaceAutoBar._timer_list.newTimerObj()
        this._timer_obj.addAction('PERIOD', ()=>{this._update()})
    }

    set curGetter(f: (()=>number) | undefined){
        this._cur_getter = undefined
        if (f){this._cur_getter = new Action(f)}
    }

    set maxGetter(f: (()=>number) | undefined){
        this._max_getter = undefined
        if(f)(this._max_getter = new Action(f))
    }

    printCur = true;
    printMax = true;
    printPerc = true;
    precision = 1;

    destroy(){
        super.destroy()
        InterfaceAutoBar._timer_list.removeTimerObj(this._timer_obj)
    }

    private _update(){
        if (!this._cur_getter || !this._max_getter){return}

        let cur = this._cur_getter.run()
        let max = this._max_getter.run()
        let part = cur / (max != 0 ? max : 1)

        let text = ' '
        if (this.printCur){
            text += float2str(cur, this.precision) + ' '
            if (this.printMax){text += '/ '}
        }

        if (this.printMax){
            text += float2str(max, this.precision) + ' '
        }

        if (this.printPerc){
            text += '(' + float2str(100 * part, 1) + '%) '
        }

        this.fullness = part
    }

    private _cur_getter: Action<[], number> | undefined;
    private _max_getter: Action<[], number> | undefined;
    private _timer_obj;

    private static _timer_list: hTimerList = new hTimerList(0.025);
}