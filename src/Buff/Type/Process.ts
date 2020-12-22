import { Buff } from "../Buff";

export abstract class TypeProcess<T> {
    protected constructor(){}

    abstract start(buff: Buff<T>):void
    abstract period(buff: Buff<T>):void
    abstract cancel(buff: Buff<T>):void
    abstract finish(buff: Buff<T>):void
}