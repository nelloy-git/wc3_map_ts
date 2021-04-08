import * as Buff from '../../Buff'

import { BuffJson } from '../JsonUtils'

export class BuffTData<T> extends Buff.TData<T> {
    constructor(prototype: BuffJson){
        super()

        this.__buff_json_prototype = prototype
        this.name = (buff) => {return this.__buff_json_prototype.name}
        this.icon = (buff) => {return this.__buff_json_prototype.icon}
        this.tooltip = (buff) => {return this.__getTooltip(buff)}
        this.stackable = () => {return this.__buff_json_prototype.stackable}
        this.add_duration = () => {return this.__buff_json_prototype.add_duration}
    }

    private __getTooltip(buff: Buff.IFace<T>){
        let template = this.__buff_json_prototype.tooltip
        let [tooltip, _] = string.gsub(template, '%b{}', (match: string) => {
            let num = tonumber(match)
            if (!num){
                return match
            }

            let user_data = buff.Data.user_data
            if (typeof user_data === 'number'){
                if (num != 0){
                    return match
                }
                return string.format('%.0f', user_data)
            } else if (typeof user_data === 'object'){
                let val = (<Array<any>><unknown>user_data)[num]
                if (typeof val !== 'number'){
                    return match
                }
                return string.format('%.0f', val)
            }

            return match
        })
        return tooltip
    }

    private __buff_json_prototype: BuffJson
}