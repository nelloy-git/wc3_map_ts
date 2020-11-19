--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Color = Wc3Utils.Color or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type HandleClass
local Handle = require('Handle') or error('')
---@type UnitClass
local Unit = require('Handle.Unit') or error('')

--=======
-- Class
--=======

local TextTag = Class.new('TextTag', Handle)
---@class TextTag : Handle
local public = TextTag.public
---@class TextTagClass : HandleClass
local static = TextTag.static
---@type TextTagClass
local override = TextTag.override
local private = {}

--=========
-- Static
--=========

---@param child TextTag | nil
---@return TextTag
function override.new(child)
    if child then isTypeErr(child, TextTag, 'child') end

    local instance = child or Class.allocate(TextTag)
    instance = Handle.new(CreateTextTag(), DestroyTextTag, instance)

    private.newData(instance)

    return instance
end

---@param text string
---@param size number
---@param red number
---@param green number
---@param blue number
---@param alpha number
---@param x number
---@param y number
---@param z number
---@param x_vel number
---@param y_vel number
---@param time number
function override.newTimed(text, size,
                           red, green, blue, alpha,
                           x, y, z,
                           x_vel, y_vel,
                           time)
    local text_tag = CreateTextTag()
    SetTextTagText(text_tag, text, 0.0023 * size)
    SetTextTagColor(text_tag, red, green, blue, alpha)
    SetTextTagPos(text_tag, x, y, z)
    SetTextTagVelocity(text_tag, x_vel, y_vel)
    SetTextTagPermanent(text_tag, false)
    SetTextTagLifespan(text_tag, time)
    SetTextTagFadepoint(text_tag, 0)
end

---@param text string
---@param size number
---@param red number
---@param green number
---@param blue number
---@param alpha number
---@param target Unit
---@param z number
---@param x_vel number
---@param y_vel number
---@param time number
function override.newTimedForUnit(text, size,
                                   red, green, blue, alpha,
                                   target, z,
                                   x_vel, y_vel,
                                   time)

    local text_tag = CreateTextTag()
    SetTextTagText(text_tag, text, 0.0023 * size)
    SetTextTagColor(text_tag, red, green, blue, alpha)
    SetTextTagPosUnit(text_tag, target:getData(), z)
    SetTextTagVelocity(text_tag, x_vel, y_vel)
    SetTextTagPermanent(text_tag, false)
    SetTextTagLifespan(text_tag, time)
    SetTextTagFadepoint(text_tag, 0)
end

--========
-- Public
--========

---@param text string
---@param size number
function public:setText(text, size)
    isTypeErr(self, TextTag, 'self')
    isTypeErr(text, 'string', 'text')
    isTypeErr(size, 'number', 'size')
    
    SetTextTagText(self:getData(), text, 0.0023 * size)
end

---@param color Color
function public:setColor(color)
    isTypeErr(self, TextTag, 'self')
    isTypeErr(color, Color, 'color')
    local priv = private.data[self]

    priv.color = Color.copy(color)
    SetTextTagColor(self:getData(),
                    math.floor(255 * color.r),
                    math.floor(255 * color.g),
                    math.floor(255 * color.b),
                    math.floor(255 * color.a))
end

---@return Color
function public:getColor()
    isTypeErr(self, TextTag, 'self')
    return Color.copy(private.data[self].color)
end

---@param x number
---@param y number
---@param z number
---@overload fun(self:TextTag, target:Unit, z:number)
function public:setPos(x, y, z)
    isTypeErr(self, TextTag, 'self')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')
    isTypeErr(z, 'number', 'z')

    if type(x) == 'number' and type(y) == 'number' and type(z) == 'number' then
        SetTextTagPos(self:getData(), x, y, z)
        return
    end

    -- Overload
    local target = x
    z = y
    isTypeErr(target, Unit, 'target')
    isTypeErr(z, 'number', 'z')
    SetTextTagPosUnit(self:getData(), target:getData(), z)
end

---@param x_vel number
---@param y_vel number
function public:setVelocity(x_vel, y_vel)
    isTypeErr(self, TextTag, 'self')
    SetTextTagVelocity(self:getData(), x_vel, y_vel)
end

---@param flag boolean
function public:setVisible(flag)
    isTypeErr(self, TextTag, 'self')
    SetTextTagVisibility(self:getData(), flag)
end

---@param flag boolean
function public:setSuspended(flag)
    isTypeErr(self, TextTag, 'self')
    SetTextTagSuspended(self:getData(), flag)
end

---@param flag boolean
function public:setPermanent(flag)
    isTypeErr(self, TextTag, 'self')
    SetTextTagPermanent(self:getData(), flag)
end

---@param age number
function public:setAge(age)
    isTypeErr(self, TextTag, 'self')
    SetTextTagAge(self:getData(), age)
end

---@param lifespan number
function public:setLifespan(lifespan)
    isTypeErr(self, TextTag, 'self')
    SetTextTagLifespan(self:getData(), lifespan)
end

---@param fadepoint number
function public:setFadepoint(fadepoint)
    isTypeErr(self, TextTag, 'self')
    SetTextTagFadepoint(self:getData(), fadepoint)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self Image
function private.newData(self)
    local priv = {
        color = Color.new(1, 1, 1, 1)
    }
    private.data[self] = priv
end


return static