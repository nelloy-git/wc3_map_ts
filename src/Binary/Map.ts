import * as Utils from '../Utils'

import { File } from './File'
import { w3dFile } from "./w3d/File";
import { w3uFile } from "./w3u/File";

export class Map {
    private constructor(){}

    static save(path: string){
        Map.saveFile(this.w3u, path + '/war3map.w3u')
        Map.saveFile(this.w3d, path + '/war3map.w3d')
    }

    private static saveFile(f: File<any>, path: string){
        let bfile = new Utils.FileBinary()
        bfile.data = f.toBinary()
        bfile.write(path)
    }

    static readonly w3u = new w3uFile()
    static readonly w3d = new w3dFile()
}

if (!IsGame()){
    MacroFinal(()=>{
        Map.save(<string>GetDst())
    })
}