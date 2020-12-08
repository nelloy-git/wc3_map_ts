import { hUnit } from "../Handle";
import { Type } from "./Type";

export interface BuffIFace {
    src: hUnit
    dst: hUnit
    type: Type<any>
    data: any

    timeLeft: number
    fullTime: number

    start(dur: number): void
    period(reduce_timeleft: boolean): void
    cancel(): void
    finish(): void
}