import { Fdf } from "../../Fdf";

type SimpleLayerType = 'ARTWORK'|'BACKGROUND'

export class SimpleLayer extends Fdf {
    constructor(type: SimpleLayerType){
        super('Layer' + (SimpleLayer._count++).toString(), 'Layer', true)
        this.layerType = type
    }

    set inherit(other: Fdf | undefined){
        error(this.toString() + ': can not inherit.', 2)
    }

    protected _setParam(param: string, value?: string){
        error(this.toString() + ': can not contain params.', 3)
    }

    protected _getParam(param: string){
        return error(this.toString() + ': can not contain params.', 3)
    }

    protected _removeParam(param: string){
        return error(this.toString() + ': can not contain params.', 3)
    }

    serialize(){
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