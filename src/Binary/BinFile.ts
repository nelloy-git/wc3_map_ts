import { BinObj } from "./BinObj"
import { int2byte } from './Utils'

export class BinFile {
    constructor(path: string){
        this.path = path
        this.data = []

        if (!IsGame()){
            BuildFinal(()=>{this.save()})
        }
    }

    public add(obj: BinObj){
        this.data.push(obj)
    }

    public save(){
        let byte = string.char

        let res = '\2\0\0\0\0\0\0\0' +
                  int2byte(this.data.length)

        for (let i = 0; i < this.data.length; i++){
            let bytes = this.data[i].serialize()
            res += bytes
        }

        let [f] = io.open(this.path, 'wb')
        f?.write(res)
        f?.close()
    }

    readonly path: string;
    private data: BinObj[];
}