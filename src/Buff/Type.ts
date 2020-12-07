import { Buff } from "./Buff";

export abstract class Type<USER_DATA> {
    protected constructor(){}

    abstract start(buff: Buff<USER_DATA>):void
    abstract period(buff: Buff<USER_DATA>):void
    abstract cancel(buff: Buff<USER_DATA>):void
    abstract finish(buff: Buff<USER_DATA>):void
    abstract name(buff: Buff<USER_DATA>):string
    abstract icon(buff: Buff<USER_DATA>):string
    abstract tooltip(buff: Buff<USER_DATA>):string
}