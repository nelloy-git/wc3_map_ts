LibManager.startLib('Wc3Utils')

--===========
-- Depencies
--===========

LibManager.addDepency('LuaClass', 'https://github.com/nelloy-git/LuaClass.git')

--=====
-- API
--=====

---@class Wc3Utils
local Wc3Utils = {}

---@type ActionClass
Wc3Utils.Action = require('Action') or error('')
---@type ActionListClass
Wc3Utils.ActionList = require('ActionList') or error('')
---@type ColorClass
Wc3Utils.Color = require('Color') or error('')
---@type ImportFile
Wc3Utils.ImportFile = require('ImportFile') or error('')
---@type SmartLoader
Wc3Utils.SmartLoader = require('SmartLoader') or error('')
---@type StringCommand
Wc3Utils.StringCommand = require('StringCommand') or error('')
---@type UtilsFunctions
local Functions = require('Functions') or error('')
Wc3Utils.id2int = Functions.id2int or error('')
Wc3Utils.int2id = Functions.int2id or error('')
Wc3Utils.isType = Functions.checkType or error('')
Wc3Utils.isTypeErr = Functions.isTypeErr or error('')
Wc3Utils.getEnum = Functions.getUniqueNumber or error('')
Wc3Utils.num2str = Functions.num2str or error('')
Wc3Utils.pairsByKeys = Functions.pairsByKeys or error('')
Wc3Utils.splitStr = Functions.splitStr or error('')
---@type UtilsSettings
local Settings = require('Settings') or error('')
Wc3Utils.isDebug = Settings.isDebug or error('')
Wc3Utils.Log = Settings.default_logger or error('')

LibManager.endLib()

return Wc3Utils