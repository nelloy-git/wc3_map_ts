--=========
-- Include
--=========

---@type LoggerClass
local Logger = require('Logger') or error('')

--=======
-- Module
--========

---@class UtilsSettings
local Settings = {}

local debug = true
function Settings.isDebug()
    return debug
end
local sep
if IsGame() then
    sep = '\\'
else
    sep = package.config:sub(1,1)
end
Settings.default_logger = Logger.new(true, true, true,
                                     true, true, true, true,
                                     (GetDst and GetDst() or '')..sep..'..'..sep..'log.txt', 'log.txt')

return Settings