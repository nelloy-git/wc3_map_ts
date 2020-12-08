import { BuffIFace } from "../IFace";

export abstract class Data {
    protected constructor(){}

    abstract name(buff: BuffIFace): string
    abstract icon(buff: BuffIFace): string
    abstract tooltip(buff: BuffIFace): string
}