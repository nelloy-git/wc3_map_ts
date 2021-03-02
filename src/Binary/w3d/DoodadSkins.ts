import { BuildtimeCache, getFileDir, Log, FileText } from "../../Utils";

const __dir__ = Macro(getFileDir())

export namespace DoodadSkins {
    let path = __dir__ + '/doodadskins.txt'
    let cache = new BuildtimeCache<string>('DoodadsSLK')

    if (!IsGame()){
        if (FileText.isExist(path)){
            let f = new FileText()
            f.read(path)
            if (f.data){
                cache.set(path, f.data)
            }
        } else {
            Log.err('can not find file ' + path)
        }
    }
    let data = cache.get(path)

    let keys = {
        model: 'file',
        scale: 'defScale',
        numVar: 'numVar'
    }

    export function isDefault(id: string){
        return data.indexOf('[' + id + ']') > 0
    }

    export function getModel(id: string, hd: boolean){
        return getByKey('model', id, hd)
    }

    export function getScale(id: string, hd: boolean){
        return tonumber(getByKey('scale', id, hd))
    }

    export function hasVariations(id: string, hd: boolean){
        let count = tonumber(getByKey('numVar', id, hd))
        print(getByKey('numVar', id, hd))
        return count ? count > 1 : false
    }

    function getByKey(k: keyof typeof keys, id: string, hd: boolean){
        let id_pos = data.indexOf('[' + id + ']')
        if (id_pos < 0){ return }

        let next_pos = data.indexOf('\n[', id_pos + 1)
        if (next_pos < 0){ next_pos = data.length }

        let start
        let end
        if (IsGame() && hd){
            let k_hd = keys[k] + ':hd='
            let k_sd = keys[k] + '='

            start = data.indexOf(k_hd, id_pos) + k_hd.length
            if (!start || start > next_pos){ start = data.indexOf(k_sd, id_pos) + k_sd.length}
            if (!start){ return }

            end = data.indexOf('\n', start)
            if (!end){ return }
        } else {
            let k_sd = keys[k] + '='

            start = data.indexOf(k_sd, id_pos) + k_sd.length
            if (!start){ return }

            end = data.indexOf('\n', start)
            if (!end){ return }
        }

        return data.substr(start, end - start)
    }

}