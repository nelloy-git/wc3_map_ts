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

--=======
-- Class
--=======

local Effect = Class.new('Effect', Handle)
---@class Effect : Handle
local public = Effect.public
---@class EffectClass : HandleClass
local static = Effect.static
---@type EffectClass
local override = Effect.override
local private = {}

--=========
-- Static
--=========

---@param model string
---@param x number
---@param y number
---@param z number
---@param child Effect | nil
---@return Effect
function override.new(model, x, y, z, child)
    isTypeErr(model, 'string', 'model')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')
    isTypeErr(z, 'number', 'z')
    if child then isTypeErr(child, Effect, 'child') end

    local instance = child or Class.allocate(Effect)
    instance = Handle.new(AddSpecialEffect(model, x, y), private.destroy, instance)
    BlzSetSpecialEffectHeight(instance:getData(), z)

    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param x number
---@param y number
---@param z number
function public:setPos(x, y, z)
    isTypeErr(self, Effect, 'self')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')
    isTypeErr(z, 'number', 'z')

    BlzSetSpecialEffectPosition(self:getData(), x, y, z)
end

---@return number
function public:getX()
    isTypeErr(self, Effect, 'self')
    return BlzGetLocalSpecialEffectX(self:getData())
end

---@return number
function public:getY()
    isTypeErr(self, Effect, 'self')
    return BlzGetLocalSpecialEffectY(self:getData())
end

---@return number
function public:getZ()
    isTypeErr(self, Effect, 'self')
    return BlzGetLocalSpecialEffectZ(self:getData())
end

---@param yaw number
---@param pitch number
---@param roll number
function public:setAngles(yaw, pitch, roll)
    isTypeErr(self, Effect, 'self')
    isTypeErr(yaw, 'number', 'yaw')
    isTypeErr(pitch, 'number', 'pitch')
    isTypeErr(roll, 'number', 'roll')
    BlzSetSpecialEffectOrientation(self:getData(), yaw, pitch, roll)
end

---@param color Color
function public:setColor(color)
    isTypeErr(self, Effect, 'self')
    isTypeErr(color, Color, 'color')
    local priv = private.data[self]

    priv.color = Color.copy(color)
    BlzSetSpecialEffectColor(self:getData(),
                             math.floor(255 * color.r),
                             math.floor(255 * color.g),
                             math.floor(255 * color.b))
    BlzSetSpecialEffectAlpha(self:getData(), math.floor(255 * color.a))
end

---@return Color
function public:getColor()
    isTypeErr(self, Effect, 'self')
    return Color.copy(private.data[self].color)
end

---@param scale number
function public:setScale(scale)
    isTypeErr(self, Effect, 'self')
    isTypeErr(scale, 'number', 'scale')
    BlzSetSpecialEffectScale(self:getData(), scale)
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self Effect
function private.newData(self)
    local priv = {
        color = Color.new(1, 1, 1, 1)
    }
    private.data[self] = priv
end

function private.destroy(handle)
    BlzSetSpecialEffectScale(handle, 0.001)
    DestroyEffect(handle)
end

return static