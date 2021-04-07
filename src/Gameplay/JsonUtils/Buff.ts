import * as Utils from '../../Utils'
import * as Json from '../../Json'

let __path__ = Macro(Utils.getFilePath())

const NAME = ['name']
const ICON = ['icon']
const TOOLTIP = ['tooltip']
const STACKABLE = ['stackable']
const APPEND_DUR = ['appendDur']

const DEFAULT_TOOLTIP_LIST = new Json.Data('AbilityJsonDefaultTooltip', (() => {
    let tbl = new LuaTable()
    tbl.set(1, 'undefined')
    return tbl
})())

export class BuffJson {
    static load(json: Json.Data, extra?: Json.Tree[]){
        let buff_json = new BuffJson();
        (<string>buff_json.name) = json.getString(NAME, 'undefined');
        (<string>buff_json.icon) = json.getString(ICON, 'undefined');
        (<boolean>buff_json.stackable) = json.getBool(STACKABLE, false);
        (<boolean>buff_json.append_dur) = json.getBool(APPEND_DUR, false);

        let tooltip_list = json.getSub(TOOLTIP, DEFAULT_TOOLTIP_LIST);
        (<string>buff_json.tooltip) = ''
        let i = 1
        while(tooltip_list.isExist([i])){
            (<string>buff_json.tooltip) += tooltip_list.getString([i], '')
            i++
        }
        
        if (extra){
            for (const tree of extra){
                if (!json.isExist(tree)){
                    return Utils.Log.err('can not find key\n' + json.tree2string(tree))
                }
                let val = json.getAny(tree)
                if (typeof val === 'object'){
                    return Utils.Log.err('extra value can not be of type "object"\n' + json.tree2string(tree))
                }
                buff_json.extra.set(tree, val)
            }
        }

        return buff_json
    }

    private constructor(){
        this.name = 'undefined'
        this.icon = 'undefined'
        this.tooltip = 'undefined'
        this.stackable = false
        this.append_dur = false
        this.extra = new Map()
    }

    readonly name: string
    readonly icon: string
    readonly tooltip: string
    readonly stackable: boolean
    readonly append_dur: boolean
    
    extra: Map<Json.Tree, any | undefined>
}