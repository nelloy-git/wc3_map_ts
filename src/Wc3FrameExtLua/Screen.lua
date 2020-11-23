--=========
-- Include
--=========

---@type Wc3Handle
local Wc3Handle = LibManager.getDepency('Wc3Handle') or error('')
local Timer = Wc3Handle.Timer or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local ActionList = Wc3Utils.ActionList or error('')

--========
-- Module
--========

---@class FrameScreen
local Screen = {}

local p_width = 0
local p_height = 0

local data = {}
data.x0 = 0
data.y0 = 0
data.width = 0.8
data.height = 0.6

local update_timer = 0
local update_period = 1

local actions = ActionList.new(Screen)

---@return number
function Screen.getX0()
    return data.x0
end

---@return number
function Screen.getY0()
    return data.y0
end

---@return number
function Screen.getWidth()
    return data.width
end

---@return number
function Screen.getHeight()
    return data.width
end

---@alias FrameScreenCallback fun(x0:number, y0:number, width:number, height:number)

---@param callback FrameScreenCallback
---@return Action
function Screen.addChangedAction(callback)
    return actions:add(callback)
end

---@param action Action
---@return boolean
function Screen.removeAction(action)
    return actions:remove(action)
end

local function updateResolution()
    local cur_p_width = BlzGetLocalClientWidth()
    local cur_p_height = BlzGetLocalClientHeight()

    -- No changes
    if cur_p_width == p_width and cur_p_height == p_height then
        return
    end

    p_width = cur_p_width
    p_height = cur_p_height

    local ui_pixel_width = cur_p_height * 4 / 3
    data.width = 0.8 * cur_p_width / ui_pixel_width
    data.x0 = -(data.width - 0.8) / 2

    actions:run(data.x0, data.y0,
                data.width, data.height)
end

if IsGame() then
    local first_timer = Timer.new()
    first_timer:start(0.01, false, function() updateResolution() first_timer:destroy() end)

    update_timer = Timer.new()
    update_timer:start(update_period, true, updateResolution)
end

return Screen