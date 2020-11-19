--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type HandleClass
local Handle = require('Handle') or error('')

--=======
-- Class
--=======

local Destrcutable = Class.new('Destructable', Handle)
---@class Destructable : Handle
local public = Destrcutable.public
---@class DestructableClass : HandleClass
local static = Destrcutable.static
---@type DestructableClass
local override = Destrcutable.override
local private = {}

--=========
-- Static
--=========

---@param id number
---@param x number
---@param y number
---@param z number
---@param face number
---@param scale number
---@param variation number
---@param child Destructable | nil
---@return Destructable
function override.new(id, x, y, z, face, scale, variation, child)
    isTypeErr(id, 'number', 'id')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')
    isTypeErr(z, 'number', 'z')
    isTypeErr(face, 'number', 'face')
    isTypeErr(scale, 'number', 'scale')
    isTypeErr(variation, 'number', 'variation')
    if child then
        isTypeErr(child, Destrcutable, 'child')
    end

    local instance = child or Class.allocate(Destrcutable)
    instance = Handle.new(CreateDestructableZ(id, x, y, z, face, scale, variation), RemoveDestructable, instance)
    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@return number
function public:getX()
    isTypeErr(self, Destrcutable, 'self')
    return GetDestructableX(self:getData())
end

---@return number
function public:getY()
    isTypeErr(self, Destrcutable, 'self')
    return GetDestructableY(self:getData())
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self Destructable
function private.newData(self, owner)
    local priv = {
        owner = owner
    }
    private.data[self] = priv
end

return static