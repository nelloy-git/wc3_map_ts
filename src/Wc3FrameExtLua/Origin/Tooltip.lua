--=========
-- Include
--=========

---@type FrameExtClass
local FrameExt = require('FrameExt')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils')
local Log = Wc3Utils.Log or error('')

--========
-- Module
--========

if not IsGame() then
    return
end

local handle = BlzGetOriginFrame(ORIGIN_FRAME_UBERTOOLTIP, 0)
BlzFrameClearAllPoints(handle)

---@class FrameExtOriginTooltip
local Tooltip = FrameExt.link(handle, false)
Tooltip:setParent(nil)

---@param width number
---@param height number
function Tooltip:setSize(width, height)
    Log:wrn('Tooltip size can not be changed.')
end

return Tooltip