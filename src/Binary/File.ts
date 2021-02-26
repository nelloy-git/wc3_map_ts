import { getFilePath, FileBinary, FileText } from "../Utils";
import { Obj } from "./Obj";

let __path__ = Macro(getFilePath)

export abstract class File<T extends Obj> {

    abstract readBinary(path: string): void
    abstract writeBinary(path: string): void

    abstract readJson(path: string): void
    abstract writeJson(path: string): void

    objects: T[] = []

    protected _file_bin = new FileBinary()
    protected _file_text = new FileText()
}