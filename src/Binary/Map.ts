import { w3dFile } from "./w3d/File";
import { w3uFile } from "./w3u/File";

export class Map {
    private constructor(){}

    static save(path: string){
        this.w3u.save(path + '/war3map.w3u')
        this.w3d.save(path + '/war3map.w3d')
    }

    static readonly w3u = new w3uFile()
    static readonly w3d = new w3dFile()
}

if (!IsGame()){
    BuildFinal(()=>{Map.save(<string>GetDst())})
}