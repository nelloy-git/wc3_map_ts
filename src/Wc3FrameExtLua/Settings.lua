--=========
-- Include
--=========

---@type FdfFileClass
local FdfFile = require('Fdf.File')

--========
-- Module
--========

---@class FrameExtSettings
local FrameExtSettings = {}

FrameExtSettings.FdfFileDefault = FdfFile.new('FrameExtDefaultFdf')
FrameExtSettings.HideBottomUI = true

print('Hide UI: '..(FrameExtSettings.HideBottomUI and 'true' or 'false'))
if IsGame() and FrameExtSettings.HideBottomUI then
    BlzEnableUIAutoPosition(false)
    BlzFrameSetAbsPoint(BlzGetFrameByName("ConsoleUI", 0), FRAMEPOINT_BOTTOM, 0.4, -0.18)
    BlzFrameSetAllPoints(BlzGetOriginFrame(ORIGIN_FRAME_WORLD_FRAME, 0), BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0))
end

return FrameExtSettings