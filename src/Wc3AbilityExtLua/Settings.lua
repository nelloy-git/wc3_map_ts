--=========
-- Include
--=========

---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Color = Wc3Utils.Color or error('')

--=======
-- Module
--========

---@class AbilityExtSettings
local Settings = {}

Settings.TargetingFriend = {
    TrackPeriod = 1 / 32,
    HighlightColor = Color.new(0.3, 1, 0.3, 1),
    CircleSize = 32,
    CircleMaxPixels = 64,
}

return Settings