import * as Fdf from '../../../Fdf'
import { Log } from '../../../Utils'

import { Frame } from "../../Frame";

export class SimpleEmpty extends Frame {
    constructor(){
        super(SimpleEmpty._default_fdf)
    }

    private static _default_fdf = (()=>{
        let fdf = new Fdf.SimpleFrame(SimpleEmpty.name + 'DefaultFdf')
        fdf.width = 0.00001
        fdf.height = 0.00001
        return fdf
    })()
}