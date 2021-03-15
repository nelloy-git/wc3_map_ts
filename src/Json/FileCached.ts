import * as Utils from '../Utils'

export class FileCached {
    constructor(path: string){
        this._file = new Utils.FileText()

        if (!IsGame()){
            this._file.read(path)
            this._file.saveCache(path)
        } else {
            this._file.loadCache(path)
        }
    }

    protected readonly _file: Utils.FileText
}