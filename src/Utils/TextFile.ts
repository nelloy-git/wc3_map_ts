import { Logger } from './Logger'
let Log = Logger.Default

export class TextFile {
    constructor(path: string){
        this.path = path
    }

    static isExist(path: string){
        let [ok, err, code] = os.rename(path, path)
        if (!ok){
            if (code == 13){
                // Permission denied, but it exists
                return true
            }
        }
        return ok ? true : false
    }

    read(){
        let [f] = io.open(this.path)
        if (!f){
            return Log.err(TextFile.name +
                           ':can not find ' + this.path)
        }
        let [context] = f.read('*a')
        f.close()
        return <string>context
    }

    write(text: string){
        let [f] = io.open(this.path, "w")
        f?.write(text)
        f?.close()
    }

    append(text: string){
        let [f] = io.open(this.path, "a+")
        f?.write(text)
        f?.close()
    }

    readonly path: string
}