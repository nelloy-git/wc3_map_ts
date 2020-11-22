--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Handle
local Wc3Handle = LibManager.getDepency('Wc3Handle') or error('')
local Arc = Wc3Handle.ImageArc or error('')
local Timer = Wc3Handle.Timer or error('')
local Unit = Wc3Handle.Unit or error('')
---@type Wc3Input
local Wc3Input = LibManager.getDepency('Wc3Input') or error('')
local Mouse = Wc3Input.Mouse or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Color = Wc3Utils.Color or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')


---@type AbilityExtClass
local AbilityExt = require('AbilityExt') or error('')
---@type AbilityExtTypeTargetingClass
local AbilityExtTypeTargeting = require('Type.Targeting') or error('')
local AbilityExtTypeTargetingPublic = Class.getPublic(AbilityExtTypeTargeting) or error('')
---@type AbilityExtSettings
local AbilityExtSettings = require('Settings') or error('')
local Settings = AbilityExtSettings.TargetingFriend or error('')

--=======
-- Class
--=======

local AbilityExtTypeTargetingFriend = Class.new('AbilityExtTypeTargetingFriend', AbilityExtTypeTargeting)
---@class AbilityExtTypeTargetingFriend
local public = AbilityExtTypeTargetingFriend.public
---@class AbilityExtTypeTargetingFriendClass
local static = AbilityExtTypeTargetingFriend.static
---@type AbilityExtTypeTargetingFriendClass
local override = AbilityExtTypeTargetingFriend.override
local private = {}

--========
-- Static
--========

---@param child AbilityExtTypeTargetingFriend | nil
---@return AbilityExtTypeTargetingFriend
function override.new(child)
    isTypeErr(child, {AbilityExtTypeTargetingFriend, 'nil'}, 'child')

    local instance = child or Class.allocate(AbilityExtTypeTargetingFriend)
    instance = AbilityExtTypeTargeting.new(instance)
    return instance
end

--========
-- Public
--========

---@param abil AbilityExt
---@param callback fun(abil:AbilityExt, target:any)
function public:start(abil, callback)
    isTypeErr(self, AbilityExtTypeTargetingFriend, 'self')
    isTypeErr(abil, AbilityExt, 'abil')
    isTypeErr(callback, 'function', 'callback')

    AbilityExtTypeTargetingPublic.start(self, abil, callback)

    -- Disable unit selection
    Wc3Input.lockSelection(true)

    private.cur = self
    private.abil = abil
    private.circle:setVisible(true)
end

---@return boolean
function public:cancel()
    isTypeErr(self, AbilityExtTypeTargetingFriend, 'self')

    if not AbilityExtTypeTargetingPublic.cancel(self) then
        return false
    end
    -- Enable unit selection
    Wc3Input.lockSelection(false)

    private.cur = nil
    private.abil = nil
    private.circle:setVisible(false)

    return true
end

---@param target Unit | nil
---@return boolean
function public:finish(target)
    isTypeErr(self, AbilityExtTypeTargetingFriend, 'self')
    isTypeErr(target, {Unit, 'nil'}, 'target')

    if not AbilityExtTypeTargetingPublic.finish(self, target) then
        return false
    end

    -- Enable unit selection
    Wc3Input.lockSelection(false)

    private.cur = nil
    private.abil = nil
    private.circle:setVisible(false)

    return true
end

--=========
-- Private
--=========

-- Constants
---@type number
private.default_size = Settings.CircleSize or error('')
---@type Color
private.highlight = Settings.HighlightColor or error('')
---@type number
private.max_pixels = Settings.CircleMaxPixels or error('')
---@type number
private.track_period = Settings.TrackPeriod or error('')

-- Data
---@type AbilityExtTypeTargetingFriend | nil
private.cur = nil
---@type AbilityExt | nil
private.abil = nil
---@type Unit | nil
private.previous = nil
---@type Color | nil
private.previous_color = nil

function private.mouseTrack()
    -- Is not active
    if not private.cur then return end

    local hovered = Unit.getMouseFocus()
    local abil_owner = private.abil:getOwner()

    -- Restore color if previous color was not changed between loops.
    if private.previous and
       hovered ~= private.previous and
       Color.compare(private.previous_color, private.previous:getColor()) then
        private.previous:setColor(private.previous_color)
    end

    local targ_x
    local targ_y
    -- Update color and circle pos
    if hovered and hovered:isAlly(abil_owner) then
        local color = hovered:getColor()
        if not Color.compare(color, private.highlight) then
            private.previous_color = color
            hovered:setColor(private.highlight)
        end

        targ_x = hovered:getX()
        targ_y = hovered:getY()
    else
        private.previous = nil
        private.previous_color = nil

        targ_x = Wc3Input.getMouseX()
        targ_y = Wc3Input.getMouseY()
    end

    local size = hovered and hovered:getCollisionSize() or private.default_size
    private.circle:setPosPolar(targ_x, targ_y, size, 0, 2 * math.pi)
end

---@param event string
---@param pl player
---@param btn mousebuttontype
function private.mouseUpCallback(event, pl, btn)
    if not private.cur or pl ~= GetLocalPlayer() then
        return
    end

    if btn == MOUSE_BUTTON_TYPE_LEFT then
        private.cur:finish()
    else
        private.cur:cancel()
    end
end

Mouse.addAction('UP', private.mouseUpCallback)

if IsGame() then
    private.timer = Timer.new()
    private.timer:start(private.track_period, true, private.mouseTrack)

    private.circle = Arc.new(private.max_pixels)
    private.circle:setVisible(false)
end

return static