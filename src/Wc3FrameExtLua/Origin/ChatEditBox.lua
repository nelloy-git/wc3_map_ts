--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type FrameExtClass
local FrameExt = require('FrameExt')
local FrameExtPublic = Class.getPublic(FrameExt) or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils')
local Log = Wc3Utils.Log or error('')

--========
-- Module
--========

if not IsGame() then
    return
end

local handle = BlzFrameGetChild(BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 11)
BlzFrameClearAllPoints(handle)

--- Can not be moved outside of default 0.8x0.6 box.
---@class FrameExtOriginChatEditBox
local ChatEditBox = FrameExt.link(handle, false)
ChatEditBox:setParent(nil)

---@param x number
---@param y number
function ChatEditBox:setPos(x, y)
    local parent = self:getParent()

    local p_abs_x = parent and parent:getAbsX() or 0
    local p_abs_y = parent and parent:getAbsY() or 0

    local abs_x = p_abs_x + x
    local abs_y = p_abs_y + y

    if (abs_x < 0) or (abs_x + self:getWidth() > 0.8) or
       (abs_y < 0) or (abs_y + self:getHeight() > 0.6) then
        Log:wrn('FrameOriginSkillButton: can not be moved correctly outside of [[0, 0], [0.8, 0.6]] rectangle because of cooldown sprite.')
    end

    FrameExtPublic.setPos(self, x, y)
end

return ChatEditBox