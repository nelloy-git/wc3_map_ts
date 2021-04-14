import { BuildtimeCache, Log, FileText } from "../../Utils";

const __dir__ = Macro(getFileDir())

export namespace DoodadsMeta {
    let path = __dir__ + '/doodadmetadata.slk'
    let cache = new BuildtimeCache<string>('DoodadsMeta')

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
    
    let raw = cache.get(path)

    export function getFields(){
        let list: string[] = []
        let found = raw.indexOf('C;X1;Y')
        found = raw.indexOf('C;X1;Y', found + 1)
        while (found > 0){
            let id_pos = raw.indexOf('K"', found)
            let cat_pos = raw.indexOf('C;X6;K', found)

            if (raw.slice(cat_pos + 7, cat_pos + 7 + 'editor'.length) != 'editor'){
                list.push(raw.slice(id_pos + 2, id_pos + 6))
            }

            found = raw.indexOf('C;X1;Y', found + 1)
        }

        return list
    }

}