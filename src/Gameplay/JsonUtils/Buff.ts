import * as Utils from '../../Utils'
import * as Json from '../../Json'

let __path__ = Macro(Utils.getFilePath())

const NAME = ['name']
const ICON = ['icon']
const TOOLTIP = ['tooltip']

const DEFAULT_TOOLTIP_LIST = new Json.Data('AbilityJsonDefaultTooltip', (() => {
    let tbl = new LuaTable()
    tbl.set(1, 'undefined')
    return tbl
})())

export class BuffJson {
    static load(json: Json.Data){
        let buff_json = new BuffJson();
        (<string>buff_json.name) = json.getString(NAME, 'undefined');
        (<string>buff_json.icon) = json.getString(ICON, 'undefined');

        let tooltip_list = json.getSub(TOOLTIP, DEFAULT_TOOLTIP_LIST);
        (<string>buff_json.tooltip) = ''
        let i = 1
        while(tooltip_list.isExist([i])){
            (<string>buff_json.tooltip) += tooltip_list.getString([i], '')
            i++
        }
        return buff_json
    }

    private constructor(){
        this.name = 'undefined'
        this.icon = 'undefined'
        this.tooltip = 'undefined'
    }

    readonly name: string
    readonly icon: string
    readonly tooltip: string
}