import { int2id, id2int } from'./Funcs'
import { Action } from './Action'
import { Color } from './Color'
import { Import } from './Import'
import { Logger } from './Logger'

let sep = IsGame() ? '\\' : _G.package.config.charAt(0);
let Log = new Logger(true, true, true,
                     true,
                     true, true, true,
                     GetDst() + sep + '..' + sep + 'log.txt',
                     'log.txt')

export { int2id, id2int }
export { Action }
export { Color }
export { Import }
export { Log }