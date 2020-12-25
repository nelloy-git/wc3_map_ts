import { hUnit } from "../Handle";
import { Type } from "./Type";

export interface IFace {
    src: hUnit
    dst: hUnit
    type: Type<any>
    data: any

    timeLeft: number
    readonly fullTime: number

    start(dur: number): void
    period(): void
    cancel(): void
    finish(): void
}