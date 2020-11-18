import { Action } from "./Action"
import { Logger } from "./Logger"

let sep = IsGame() ? '\\' : _G.package.config.charAt(0);
let Log = new Logger(true, true, true,
                     true,
                     true, true, true,
                     GetDst() + sep + '..' + sep + 'log.txt',
                     'log.txt')

string.

export { Action }
export { Log }
//export { string }
