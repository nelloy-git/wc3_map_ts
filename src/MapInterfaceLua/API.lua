LibManager.startLib('MapInterface')

--===========
-- Depencies
--===========

LibManager.addDepency('LuaClass', 'https://github.com/nelloy-git/LuaClass.git')
LibManager.addDepency('Wc3AbilityExt', 'https://github.com/nelloy-git/Wc3AbilityExt.git')
LibManager.addDepency('Wc3FrameExt', 'https://github.com/nelloy-git/Wc3FrameExt.git')
LibManager.addDepency('Wc3Input', 'https://github.com/nelloy-git/Wc3Input.git')
LibManager.addDepency('Wc3Handle', 'https://github.com/nelloy-git/Wc3Handle.git')
LibManager.addDepency('Wc3Utils', 'https://github.com/nelloy-git/Wc3Utils.git')

--=====
-- API
--=====

---@class MapInterface
local MapInterface = {}

local init = require('Init')

LibManager.endLib()

return MapInterface