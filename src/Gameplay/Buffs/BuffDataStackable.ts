import { BuffTData } from './BuffTData'
import { BuffJson } from '../JsonUtils'
import { Log } from '../../Utils'

const IS_STACKABLE = ['stackable']
const APPEND_DUR = ['appendDur']

export class BuffDataStackable<T> extends BuffTData<T> {
    constructor(prototype: BuffJson){
        super(prototype)

        let stackable = prototype.extra.get(IS_STACKABLE)
        if (stackable == undefined){
            Log.err('')
        }

        let append_dur = prototype.extra.get(APPEND_DUR)
        if (append_dur == undefined){
            Log.err('')
        }

        this.stackable = stackable
        this.append_dur = append_dur
    }

    readonly stackable: boolean
    readonly append_dur: boolean
}