import * as Fdf from '../../../Fdf'

import { Frame } from "../../Frame";

export class SimpleEmpty extends Frame {

    constructor(){
        super(DefaultFdf, true)
    }
}

let DefaultFdf = new Fdf.SimpleFrame(SimpleEmpty.name + 'DefaultFdf')
DefaultFdf.width = 0.00001
DefaultFdf.height = 0.00001