import { Logger } from '../Logger'
import { getFilePath } from '../Funcs'
import { FileIFace } from './IFace'
let Log = Logger.Default

let __path__ = Macro(getFilePath())

export class FileText extends FileIFace {

    read(path: string){
        let [f] = io.open(path, 'r')
        if (!f){
            return Log.err('can not open ' + path,
                            __path__, FileText, 2)
        }
        let [data] = f.read('*a')

        if (!data){
            Log.err('can not read file ' + path,
                    __path__, FileText, 2)
            return
        }
        f.close()

        this.data = data
    }

    write(path: string){
        let [f] = io.open(path, "w")
        if (!f){
            return Log.err('can not open ' + path,
                            __path__, FileText, 2)
        }

        if (!this.data){
            Log.err('file data is empty ' + path,
                    __path__, FileText, 2)
            return
        }

        f.write(this.data)
    }

    append(path: string){
        let [f] = io.open(path, "a+")
        if (!f){
            return Log.err('can not open ' + path,
                            __path__, FileText, 2)
        }

        if (!this.data){
            Log.err('file data is empty ' + path,
                    __path__, FileText, 2)
            return
        }

        f.write(this.data)
    }

    data: string | undefined
}