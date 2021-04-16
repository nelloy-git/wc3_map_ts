import { FileBinary } from "../../Utils";
import { Obj } from "../Obj";
import { str2byte } from "../Utils";

export class w3iPrologueScreen extends Obj{
    static fromBinary(file: FileBinary){
        let ls = new w3iPrologueScreen()

        ls.path = file.readString()
        ls.text = file.readString()
        ls.title = file.readString()
        ls.subtitle = file.readString()

        return ls
    }

    toBinary(){
        return str2byte(this.path)
               + str2byte(this.text)
               + str2byte(this.title)
               + str2byte(this.subtitle)
    }

    path: string = ''
    text: string = ''
    title: string = ''
    subtitle: string = ''
}