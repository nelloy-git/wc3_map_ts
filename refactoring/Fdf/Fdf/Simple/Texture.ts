import { getFilePath, Log } from "../../../../src/Utils";
import { Fdf } from "../../Fdf";

let __path__ = Macro(getFilePath())

export class SimpleTexture extends Fdf {
    constructor(name: string){
        super(name, 'Texture', true)
    }

    public get textureFile(){return this._file}
    public set textureFile(path: string){
        this._setParam('File', '\"' + path + '\"')
        this._file = path
    }

    public addSubframe(){
        return Log.err('can not have subframes.',
                        __path__, SimpleTexture, 2)
    }
    public getSubframe(){
        return Log.err('can not have subframes.',
                        __path__, SimpleTexture, 2)
    }
    public removeSubframe(){
        return Log.err('can not have subframes.',
                        __path__, SimpleTexture, 2)
    }

    public serialize(){
        let res = string.format("%s \"%s\" {\n", this.base_type, this.name)
        for (let [param, value] of this._parameters){
            res += '    ' + param + ' ' + value + ',\n'
        }
        res += '}'
        return res
    }

    private _file: string = ''
}