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

local SkillButton = {}

for i = 0, 11 do
    local handle = BlzGetFrameByName("CommandButton_"..tonumber(i), 0)
    BlzFrameClearAllPoints(handle)

    ---@class FrameOriginSkillButton
    local btn = FrameExt.link(handle, false)
    SkillButton[i + 1] = btn
    btn:setParent(nil)

    ---@param x number
    ---@param y number
    function btn:setPos(x, y)
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

    ---@param width number
    ---@param height number
    function btn:setSize(width, height)
        FrameExtPublic.setSize(self, width, height)
        Log:wrn('FrameOriginSkillButton: can not be resized correctly because of cooldown sprite.')
    end

    function btn:addAction()
        Log:wrn('FrameOriginSkillButton: can not activate events.')
    end
end

return SkillButton