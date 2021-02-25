import { BuildtimeCache, getFileDir, Log, TextFile } from "../../Utils";

const __dir__ = Macro(getFileDir())

export namespace DoodadsSLK {
    let path = __dir__ + '/doodads.slk'
    let cache = new BuildtimeCache<string>('DoodadsSLK')

    if (!IsGame()){
        if (TextFile.isExist(path)){
            let f = new TextFile(path)
            cache.set(path, f.read())
        } else {
            Log.err('can not find file ' + path)
        }
    }
    
    let raw = cache.get(path)

    export function getModel(id: string){
        let id_pos = raw.indexOf('K\"' + id + '\"')
        if (id_pos < 0){
            return
        }

        let model_start = raw.indexOf('X5;K', id_pos) + 5
        if (model_start < 0){
            return
        }

        let model_end = raw.indexOf('\n', model_start) - 1
        if (model_end < 0){
            return
        }

        return raw.substr(model_start, model_end - model_start)
    }

}