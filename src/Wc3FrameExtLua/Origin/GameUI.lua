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

local handle = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)
--BlzFrameClearAllPoints(handle)

---@class FrameExtOriginGameUI
local GameUI = FrameExt.link(handle, false)

return GameUI