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

        let res = byte(2) + byte(0) + byte(0) + byte(0) +
                  byte(0) + byte(0) + byte(0) + byte(0) +
                  int2byte(this.data.length)

        for (let i = 0; i < this.data.length; i++){
            res += this.data[i].serialize()
        }

        let [f] = io.open(this.path, 'w')
        f?.write(res)
        f?.close()
    }

    readonly path: string;
    private data: BinObj[];
}