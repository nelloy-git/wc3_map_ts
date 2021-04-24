import { Fdf } from "../../Fdf"

export class SimpleTexture extends Fdf {
    constructor(name: string){
        super(name, 'Texture', true)
    }

    get textureFile(){return this._file}
    set textureFile(path: string){
        this._setParam('File', '\"' + path + '\"')
        this._file = path
    }

    addSubframe(){
        return error(this.toString() + ':can not have subframes.', 2)
    }
    getSubframe(){
        return error(this.toString() + ':can not have subframes.', 2)
    }
    removeSubframe(){
        return error(this.toString() + ':can not have subframes.', 2)
    }

    serialize(){
        let res = string.format("%s \"%s\" {\n", this.base_type, this.name)
        for (let [param, value] of this._parameters){
            res += '    ' + param + ' ' + value + ',\n'
        }
        res += '}'
        return res
    }

    private _file: string = ''
}