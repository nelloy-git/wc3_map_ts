import { Buff } from "..";

export abstract class Process<T> {
    protected constructor(){}

    abstract start(buff: Buff<T>):void
    abstract period(buff: Buff<T>):void
    abstract cancel(buff: Buff<T>):void
    abstract finish(buff: Buff<T>):void
}