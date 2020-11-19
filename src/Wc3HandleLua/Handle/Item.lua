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

local Item = Class.new('Item', Handle)
---@class Item : Handle
local public = Item.public
---@class ItemClass : HandleClass
local static = Item.static
---@type ItemClass
local override = Item.override
local private = {}

--=========
-- Static
--=========

---@param id number
---@param x number
---@param y number
---@param child Item | nil
---@return Item
function override.new(id, x, y, child)
    isTypeErr(id, 'number', 'Item_id')
    isTypeErr(x, 'number', 'x')
    isTypeErr(y, 'number', 'y')
    if child then isTypeErr(child, Item, 'child') end

    local instance = child or Class.allocate(Item)
    instance = Handle.new(CreateItem(id, x, y), RemoveItem, instance)
    private.newData(instance)

    return instance
end

--========
-- Public
--========

---@param x number | nil
---@param y number | nil
function public:setPos(x, y)
    isTypeErr(self, Item, 'self')
    isTypeErr(x, Item, 'x')
    isTypeErr(y, Item, 'y')

    SetItemPosition(self:getData(), x, y)
end

---@return number
function public:getX()
    isTypeErr(self, Item, 'self')
    return GetItemX(self:getData())
end

---@return number
function public:getY()
    isTypeErr(self, Item, 'self')
    return GetItemY(self:getData())
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})

---@param self Item
function private.newData(self)
    local priv = {
    }
    private.data[self] = priv
end

return static