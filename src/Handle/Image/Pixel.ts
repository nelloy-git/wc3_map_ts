import { Import } from '../../Utils'
import { Image } from "../Image";

export class Pixel extends Image {
    constructor(size: number){
        super(Pixel._import_file.dst, size, size, size)
    }

    private static _import_file = new Import(GetSrc() + '\\Handle\\Image\\Pixel\\Pixel.dds',
                                             'war3mapImported\\Pixel\\Pixel.dds')
}