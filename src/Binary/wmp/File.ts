import { File } from "../File";
import { Path } from "./Path";

let __head: string
let __version: number
let __width: number
let __height: number

export class wmpFile extends File<Path> {

    constructor(path: string){
        super(path)

        this._head = __head
        this._version = __version
        this._width = __width
        this._height = __height
    }

    get head(){return this._head}
    get version(){return this._version}
    get width(){return this._width}
    get height(){return this._height}

    protected _parse(){
        let list: Path[] = []

        __head = this._readChar(4)
        __version = this._readInt(4)
        __width = 128 * this._readInt(4)
        __height = 128 * this._readInt(4)

        for (let y = 0; y < __height; y += 32){
            for (let x =  0; x < __width; x += 32){
                let data = Path.create(x, y, this._readChar(1).charCodeAt(0))
                list.push(data)
            }
        }

        return list
    }
    
    private _head: string
    private _version: number
    private _width: number
    private _height: number
}