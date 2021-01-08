import { Import } from '../../Utils'
import { hImage } from "../Image";

export class hImagePixel extends hImage {
    constructor(size: number){
        super(hImagePixel._import_file.dst, size, size, size)
    }

    private static _import_file = new Import(GetSrc() + '\\Handle\\Image\\Pixel\\Pixel.dds',
                                             'war3mapImported\\Pixel\\Pixel.dds')
}