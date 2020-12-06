import { BinFile } from "../BinFile";
import { BinObj } from "../BinObj";
import { BinUnitField } from "../ObjField/Unit";
import { byte2id } from "../Utils";

export class BinUnit extends BinObj {
    constructor(id: number, base: number | string){
        if (typeof id === 'string'){id = byte2id(id)}
        if (typeof base === 'string'){base = byte2id(base)}

        super(id, base)

        BinUnit._file.add(this)
    }

    public getValue(field: BinUnitField){return this._getValue(field)}
    public setValue(field: BinUnitField, val: string | number | boolean | undefined){
        this._setValue(field, val)
    }

    private static _path = Macro(GetDst() + _G.package.config.charAt(0) + 'war3map.w3u')
    private static _file = new BinFile(BinUnit._path as string)
}