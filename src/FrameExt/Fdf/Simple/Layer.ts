import { Log } from "../../../Utils";
import { Fdf } from "../../Fdf";

type SimpleLayerType = 'ARTWORK'|'BACKGROUND'

export class SimpleLayer extends Fdf {
    constructor(type: SimpleLayerType){
        super('Layer' + (SimpleLayer._count++).toString(), 'Layer', true)
        this.layerType = type
    }

    public set inherit(other: Fdf | undefined){
        Log.err(SimpleLayer.name + 
                ': can not inherit.', 2)
    }

    public serialize(){
        let res = string.format("Layer \"%s\" {", this.layerType)
        for (let [param, value] of this._parameters){
            res += '    ' + param + ' ' + value + ',\n'
        }
        for (let [sub_name, sub] of this._subframes){
            res += '\n    ' + sub.serialize().replaceAll('\n', '\n    ') + '\n'
        }
        res += '}'
        return res
    }

    readonly layerType: SimpleLayerType;
    private static _count = 0
}