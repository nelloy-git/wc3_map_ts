import { IFace } from "../IFace";

export abstract class TypeData {
    protected constructor(){}

    abstract name(buff: IFace): string
    abstract icon(buff: IFace): string
    abstract tooltip(buff: IFace): string
}