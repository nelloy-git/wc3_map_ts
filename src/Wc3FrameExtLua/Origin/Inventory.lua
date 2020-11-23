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

local handle = BlzFrameGetParent(BlzFrameGetParent(BlzGetOriginFrame(ORIGIN_FRAME_ITEM_BUTTON, 0)))
BlzFrameClearAllPoints(handle)

---@class FrameExtOriginInventory
local Inventory = FrameExt.link(handle, false)
Inventory:setParent(nil)

return Inventory