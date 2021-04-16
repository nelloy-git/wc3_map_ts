import { FileBinary } from "../../Utils";
import { Obj } from "../Obj";
import { int2byte, str2byte } from "../Utils";

export class w3iLoadingScreen extends Obj{
    static fromBinary(file: FileBinary){
        let ls = new w3iLoadingScreen()

        ls.backgound_preset = file.readInt(4)
        ls.model = file.readString()
        ls.text = file.readString()
        ls.title = file.readString()
        ls.subtitle = file.readString()

        return ls
    }

    toBinary(){
        return int2byte(this.backgound_preset)
               + str2byte(this.model)
               + str2byte(this.text)    
               + str2byte(this.title)    
               + str2byte(this.subtitle)
    }

    backgound_preset: number = -1
    model: string = ''
    text: string = ''
    title: string = ''
    subtitle: string = ''
}