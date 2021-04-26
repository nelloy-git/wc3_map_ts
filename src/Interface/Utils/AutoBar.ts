// import * as Frame from "../../FrameExt"
// import { Vec2 } from '../../Utils'

// import { hTimerList } from "../../Handle";
// import { Action } from "../../Utils";

// export class InterfaceAutoBar extends Frame.SimpleStatusBarExt {
//     constructor(){
//         super()
        
//         this._timer_obj = InterfaceAutoBar._timer_list.newTimerObj()
//         this._timer_obj.addAction('PERIOD', ()=>{this._updateVals()})
//         this._timer_obj.addAction('FINISH', ()=>{this._timer_obj.start(3600)})
//         this._timer_obj.start(3600)
//     }

//     protected _set_size(size: Vec2){
//         super._set_size(size)
//         let text = this.getElement('TEXT')
//         if (text){text.fontSize = 0.8 * size.y}
//     }

//     set curGetter(f: ((this: void)=>number) | undefined){
//         this._cur_getter = f ? new Action(f) : undefined
//     }

//     set maxGetter(f: ((this: void)=>number) | undefined){
//         this._max_getter = f ? new Action(f) : undefined
//     }

//     printCur = true;
//     printMax = true;
//     printPerc = true;
//     precision = 1;

//     destroy(){
//         super.destroy()
//         InterfaceAutoBar._timer_list.removeTimerObj(this._timer_obj)
//     }

//     private _updateVals(){
//         if (!this._cur_getter || !this._max_getter){return}

//         let cur = this._cur_getter.run()
//         let max = this._max_getter.run()
//         let part = cur / (max != 0 ? max : 0.00000001)

//         let text = ' '
//         if (this.printCur){
//             text += string.format('%.0f ', cur)
//             if (this.printMax){text += '/ '}
//         }

//         if (this.printMax){
//             text += string.format('%.0f ', max)
//         }

//         if (this.printPerc){
//             text += '(' + string.format('%.1f', part) + '%) '
//         }

//         this.fullness = part
//         let text_elem = this.getElement('TEXT')
//         if (text_elem){text_elem.text = text}
//     }

//     private _cur_getter: Action<[], number> | undefined;
//     private _max_getter: Action<[], number> | undefined;
//     private _timer_obj;

//     private static _timer_list: hTimerList = new hTimerList(0.025);
// }