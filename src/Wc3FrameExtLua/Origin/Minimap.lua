--=========
-- Include
--=========

---@type FrameExtClass
local FrameExt = require('FrameExt')

--========
-- Module
--========

if not IsGame() then
    return
end

local handle = BlzGetFrameByName("MiniMapFrame", 0)
BlzFrameClearAllPoints(handle)

---@class FrameExtOriginMinimap
local Minimap = FrameExt.link(handle, false)
Minimap:setParent(nil)

return Minimap