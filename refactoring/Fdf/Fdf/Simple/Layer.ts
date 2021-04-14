import { getFilePath, Log } from "../../../../src/Utils";
import { Fdf } from "../../Fdf";

let __path__ = Macro(getFilePath())

type SimpleLayerType = 'ARTWORK'|'BACKGROUND'

export class SimpleLayer extends Fdf {
    constructor(type: SimpleLayerType){
        super('Layer' + (SimpleLayer._count++).toString(), 'Layer', true)
        this.layerType = type
    }

    public set inherit(other: Fdf | undefined){
        Log.err('can not inherit.',
                __path__, SimpleLayer, 2)
    }

    protected _setParam(param: string, value?: string){
        return Log.err('can not contain params.',
                        __path__, SimpleLayer, 3)
    }

    protected _getParam(param: string){
        return Log.err('can not contain params.',
                       __path__, SimpleLayer, 3)
    }

    protected _removeParam(param: string){
        return Log.err('can not contain params.',
                       __path__, SimpleLayer, 3)
    }

    public serialize(){
        let res = string.format("Layer \"%s\" {", this.layerType)
        for (let [sub_name, sub] of this._subframes){
            res += '\n    ' + string.gsub(sub.serialize(), '\n', '\n    ')[0] + '\n'
        }
        res += '}'
        return res
    }

    readonly layerType: SimpleLayerType;
    private static _count = 0
}