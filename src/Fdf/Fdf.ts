import { getFilePath, Log } from '../Utils';
import { File } from './File';
import { IFace } from './IFace'

let __path__ = Macro(getFilePath())

export abstract class Fdf implements IFace{
    constructor(name: string, base_type: string, is_simple: boolean, file?: File) {
        this.name = name
        this.base_type = base_type
        this.is_simple = is_simple
        this.file = file ? file : Fdf._file

        if (Fdf._name2fdf.get(name)){
            return Log.err('frame with the same name already exists. "' + name + '"',
                            __path__, Fdf, 2)
        }
        Fdf._name2fdf.set(name, this)

        this.file.add(this)
    }

    public get inherit(){return this._inherit}
    public set inherit(other: Fdf | undefined){
        if (other && other.base_type != this.base_type){
            Log.err('can not inherit from different base type.',
                    __path__, Fdf, 2)
        }
        this._inherit = other
    }

    public addSubframe(fdf: Fdf){
        if (fdf.is_simple != this.is_simple){
            Log.err('simple and normal frames can not be combined.',
                    __path__, Fdf, 2)
        }
        this._subframes.set(fdf.name, fdf)
        this.file.remove(fdf)
    }

    public getSubframe(name: string){
        return this._subframes.get(name)
    }

    public removeSubframe(name: string){
        return this._subframes.delete(name)
    }

    public serialize(){
        let res = string.format('Frame \"%s\" \"%s\"', this.base_type, this.name)
        if (this.inherit){res += ' INHERITS ' + this.inherit.name}
        res += ' {\n'

        for (let [param, value] of this._parameters){
            res += '    ' + param
            if (value != Fdf._param_null){res += ' ' + value}
            res += ',\n'
        }

        for (let [sub_name, sub] of this._subframes){
            res += '\n    ' + string.gsub(sub.serialize(), '\n', '\n    ')[0] + '\n'
        }

        res += '}'

        return res
    }

    protected _setParam(param: string, value?: string){
        if (!value){value = Fdf._param_null}
        this._parameters.set(param, value)
    }

    protected _getParam(param: string){
        return this._parameters.get(param)
    }

    protected _removeParam(param: string){
        return this._parameters.delete(param)
    }

    readonly name: string
    readonly base_type: string;
    readonly is_simple: boolean;
    readonly file: File;

    protected _parameters = new Map<string, string>()
    protected _subframes = new Map<string, Fdf>()
    private _inherit: Fdf | undefined;

    private static _file = new File('FrameExtFdf')
    private static _param_null = 'NULL'
    private static _name2fdf = new Map<string, Fdf>()
}