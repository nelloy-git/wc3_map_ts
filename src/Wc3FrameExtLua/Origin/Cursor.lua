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

local count = BlzFrameGetChildrenCount(BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0))
local handle = BlzFrameGetChild(BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), count - 1)
BlzFrameClearAllPoints(handle)

---@class FrameExtOriginCursor
local Cursor = FrameExt.link(handle, false)

return Cursor