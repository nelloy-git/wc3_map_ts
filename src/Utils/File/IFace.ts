import { BuildtimeCache } from "../BuildtimeCache"
import { decode64, encode64 } from '../Encode64'

export abstract class FileIFace {
    static isExist(path: string){
        let [ok, err, code] = os.rename(path, path)
        if (!ok){
            if (<number><unknown>code == 13){
                // Permission denied, but it exists
                return true
            }
        }
        return ok ? true : false
    }

    abstract read(path: string): void
    abstract write(path: string): void

    saveCache(path: string, encode: (data: string) => string = encode64){
        let data = this.data ? this.data : ''
        FileIFace.__cache.set(path, encode(data))
    }

    loadCache(path: string, decode: (data: string) => string = decode64){
        let data = FileIFace.__cache.get(path)
        if (typeof data !== 'string'){
            error('can not load file data from ' + path, 2)
        }
        this.data = decode(data)
    }

    data: string | undefined

    private static __cache = new BuildtimeCache(FileIFace.name)
}