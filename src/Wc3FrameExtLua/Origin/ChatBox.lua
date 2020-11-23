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

local handle = BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0)
BlzFrameClearAllPoints(handle)

---@class FrameExtOriginChatBox
local ChatBox = FrameExt.link(handle, false)
ChatBox:setParent(nil)

return ChatBox