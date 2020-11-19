--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local Color = Wc3Utils.Color or error('')
local id2int = Wc3Utils.id2int or error('')
local int2id = Wc3Utils.int2id or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')
local Log = Wc3Utils.Log or error('')

---@type HandleClass
local Handle = require('Handle') or error('')

--=======
-- Class
--=======

local Unit = Class.new('Unit', Handle)
---@class Unit : Handle
local public = Unit.public
---@class UnitClass : HandleClass
local static = Unit.static
---@type UnitClass
local override = Unit.override
local private = {}

--=========
-- Static
--=========

---@param unit_id number
---@param x number
---@param y number
---@param owner player
---@param child Unit | nil
---@return Unit
function override.new(unit_id, x, y, owner, child)
    isTypeErr(unit_id, 'number', 'unit_id')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')
    isTypeErr(owner, 'player', 'owner')
    if child then isTypeErr(child, Unit, 'child') end

    local handle = CreateUnit(owner, unit_id, x, y, 0)
    if not handle then
        Log:err('Can not create unit('..int2id(unit_id)..')', 2)
    end

    local instance = child or Class.allocate(Unit)
    instance = Handle.new(handle, RemoveUnit, instance)
    private.newData(instance, owner)

    return instance
end

---@param x number
---@param y number
---@param r number
---@return Unit[]
function static.getInRange(x, y, r)
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')
    isTypeErr(r, 'number', 'r')

    GroupEnumUnitsInRange(private.group, x, y, r)
    local cur = FirstOfGroup(private.group)
    local list = {}
    while cur do
        table.insert(list, static.getLinked(cur))
        GroupRemoveUnit(private.group, cur)
        cur = FirstOfGroup(private.group)
    end

    return list
end

---@return Unit | nil
function static.getMouseFocus()
    return Unit.getLinked(BlzGetMouseFocusUnit())
end

--========
-- Public
--========

---@param x number | nil
---@param y number | nil
---@param z number | nil
function public:setPos(x, y, z)
    isTypeErr(self, Unit, 'self')

    if x then
        isTypeErr(x, 'number', 'x')
        SetUnitX(self:getData(), x)
    end
    if y then
        isTypeErr(y, 'number', 'y')
        SetUnitY(self:getData(), y)
    end
    if z then
        isTypeErr(z, 'number', 'z')
        SetUnitFlyHeight(self:getData(), z, 0)
    end
end

---@return number
function public:getX()
    isTypeErr(self, Unit, 'self')
    return GetUnitX(self:getData())
end

---@return number
function public:getY()
    isTypeErr(self, Unit, 'self')
    return GetUnitY(self:getData())
end

---@return number
function public:getZ()
    isTypeErr(self, Unit, 'self')
    return GetUnitFlyHeight(self:getData())
end

---@return player
function public:getOwner()
    isTypeErr(self, Unit, 'self')
    return private.data[self].owner
end

---@param val number
function public:setMana(val)
    isTypeErr(self, Unit, 'self')
    isTypeErr(val, 'number', 'val')
    SetUnitState(self:getData(), UNIT_STATE_MANA, val)
end

---@return number
function public:getMana()
    isTypeErr(self, Unit, 'self')
    return GetUnitState(self:getData(), UNIT_STATE_MANA)
end

---@return number
function public:getMaxMana()
    isTypeErr(self, Unit, 'self')
    return GetUnitState(self:getData(), UNIT_STATE_MAX_MANA)
end

---@param val number
function public:setLife(val)
    isTypeErr(self, Unit, 'self')
    isTypeErr(val, 'number', 'val')
    SetUnitState(self:getData(), UNIT_STATE_LIFE, val)
end

---@return number
function public:getLife()
    isTypeErr(self, Unit, 'self')
    return GetUnitState(self:getData(), UNIT_STATE_LIFE)
end

---@return number
function public:getMaxLife()
    isTypeErr(self, Unit, 'self')
    return GetUnitState(self:getData(), UNIT_STATE_MAX_LIFE)
end

---@param other_unit Unit
---@return boolean
function public:isEnemy(other_unit)
    isTypeErr(self, Unit, 'self')
    isTypeErr(other_unit, Unit, 'other_unit')
    return IsUnitEnemy(self:getData(), private.data[other_unit].owner)
end

---@param other_unit Unit
---@return boolean
function public:isAlly(other_unit)
    isTypeErr(self, Unit, 'self')
    isTypeErr(other_unit, Unit, 'other_unit')
    return IsUnitAlly(self:getData(), private.data[other_unit].owner)
end

---@param color Color
function public:setColor(color)
    isTypeErr(self, Unit, 'self')
    isTypeErr(color, Color, 'color')
    local priv = private.data[self]

    priv.color = Color.copy(color)
    SetUnitVertexColor(self:getData(),
                       math.floor(255 * color.r),
                       math.floor(255 * color.g),
                       math.floor(255 * color.b),
                       math.floor(255 * color.a))
end

---@return Color
function public:getColor()
    isTypeErr(self, Unit, 'self')
    return Color.copy(private.data[self].color)
end

---@param index number
function public:setAnimation(index)
    isTypeErr(self, Unit, 'self')
    isTypeErr(index, 'number', 'index')
    SetUnitAnimationByIndex(self:getData(), index)
end

---@param scale number
function public:setScale(scale)
    isTypeErr(self, Unit, 'self')
    isTypeErr(scale, 'number', 'scale')
    SetUnitScale(self:getData(), scale, scale, scale)
end

---@return number
function public:getCollisionSize()
    isTypeErr(self, Unit, 'self')
    return BlzGetUnitCollisionSize(self:getData())
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.group = IsGame() and CreateGroup() or nil

---@param self Unit
---@param owner player
function private.newData(self, owner)
    local priv = {
        owner = owner,
        color = Color.new(1, 1, 1, 1)
    }
    private.data[self] = priv

    -- Turn on height change
    UnitAddAbility(self:getData(), id2int('Arav'))
    UnitRemoveAbility(self:getData(), id2int('Arav'))
end

return static