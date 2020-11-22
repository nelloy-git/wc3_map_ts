--=========
-- Include
--=========

local Class = LibManager.getDepency('LuaClass') or error('')
---@type Wc3Handle
local Wc3Handle = LibManager.getDepency('Wc3Handle') or error('')
local Unit = Wc3Handle.Unit or error('')
---@type Wc3Utils
local Wc3Utils = LibManager.getDepency('Wc3Utils') or error('')
local isTypeErr = Wc3Utils.isTypeErr or error('')

---@type AbilityExtClass
local AbilityExt = require('AbilityExt')
---@type AbilityExtTypeClass
local AbilityExtType = require('Type')

--=======
-- Class
--=======

local AbilityExtContainer = Class.new('AbilityExtContainer')
---@class AbilityExtContainer
local public = AbilityExtContainer.public
---@class AbilityExtContainerClass
local static = AbilityExtContainer.static
---@type AbilityExtContainerClass
local override = AbilityExtContainer.override
local private = {}

--=========
-- Static
--=========

---@param owner Unit
---@param child AbilityExtContainer | nil
---@return AbilityExtContainer
function override.new(owner, child)
    isTypeErr(owner, Unit, 'owner')
    isTypeErr(child, {AbilityExtContainer, 'nil'}, 'child')

    if private.owners[owner] ~= nil then
        return private.owners[owner]
    end

    local instance = child or Class.allocate(AbilityExtContainer)
    private.newData(instance, owner)

    return instance
end

function static.get(owner)
    return private.owners[owner]
end

--========
-- Public
--========

---@return Unit
function public:getOwner()
    isTypeErr(self, AbilityExtContainer, 'self')
    return private.data[self].owner
end

---@param pos number
---@param abil_type AbilityExtType | nil
function public:set(pos, abil_type)
    isTypeErr(self, AbilityExtContainer, 'self')
    isTypeErr(pos, 'number', 'pos')
    isTypeErr(abil_type, {AbilityExtType, 'nil'}, 'abil_type')
    local priv = private.data[self]

    local prev = priv.abil_list[pos]
    if prev then
        private.abil2container[prev] = nil
    end

    local abil = nil
    if abil_type then
        abil = AbilityExt.new(priv.owner, abil_type)
    end
    priv.abil_list[pos] = abil
end

---@param pos number
---@return AbilityExt | nil
function public:get(pos)
    isTypeErr(self, AbilityExtContainer, 'self')
    isTypeErr(pos, 'number', 'pos')
    return private.data[self].abil_list[pos]
end

---@return AbilityExt[]
function public:getAll()
    isTypeErr(self, AbilityExtContainer, 'self')
    local priv = private.data[self]

    local copy = {}
    for k,v in pairs(priv.abil_list) do
        copy[k] = v
    end

    return copy
end

--=========
-- Private
--=========

private.data = setmetatable({}, {__mode = 'k'})
private.owners = setmetatable({}, {__mode = 'k'})

---@param self AbilityExtContainer
---@param owner Unit
function private.newData(self, owner)
    local priv = {
        owner = owner,
        abil_list = {},
    }
    private.data[self] = priv
    private.owners[owner] = self
end

return static