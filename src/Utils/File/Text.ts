import { FileIFace } from './IFace'

export class FileText extends FileIFace {

    read(path: string){
        let [f] = io.open(path, 'r')
        if (!f){
            error('can not open ' + path, 2)
        }
        let [data] = f.read('*a')

        if (!data){
            error('can not read file ' + path, 2)
        }
        f.close()

        this.data = data
    }

    write(path: string){
        let [f] = io.open(path, "w")
        if (!f){
            error('can not open ' + path, 2)
        }

        if (!this.data){
            error('file data is empty ' + path, 2)
        }

        f.write(this.data)
    }

    append(path: string){
        let [f] = io.open(path, "a+")
        if (!f){
            error('can not open ' + path, 2)
        }

        if (!this.data){
            error('file data is empty ' + path, 2)
        }

        f.write(this.data)
    }

    data: string | undefined
}